import {
  Construct,
  Duration,
  Stack,
  StackProps,
  Tags,
} from '@aws-cdk/core';
import { join } from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Queue } from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { Vpc } from '@aws-cdk/aws-ec2';
import { ServerlessCluster, DatabaseClusterEngine, ParameterGroup } from '@aws-cdk/aws-rds';

interface CryptoBotProps extends StackProps {
  environmentName: string;
}

export class CryptoBotStack extends Stack {
  constructor(scope: Construct, id: string, props: CryptoBotProps) {
    super(scope, id, props);

    Tags.of(this).add('Name', 'Crypto Bot Stack');
    Tags.of(this).add('env', props.environmentName);
    Tags.of(this).add('purpose', 'Show how to build a serverless crypto bot');
    Tags.of(this).add('owner', 'RobertoChupin');
    Tags.of(this).add('product', 'Crypto-Bot');
    Tags.of(this).add('managed_by', 'CDK');

    // Create the VPC needed for the Aurora Serverless DB cluster
    const vpc = new Vpc(this, 'CryptoBotAppVPC');

    //0. Create the Serverless Aurora DB cluster; set the engine to Postgres
    const cluster = new ServerlessCluster(this, 'AuroraCryptoBotCluster', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      defaultDatabaseName: 'CryptoBotDB',
      vpc,
      scaling: { autoPause: Duration.seconds(0) } // Optional. If not set, then instance will pause after 5 minutes 
    });

    //1. Set Rule to run initiateLookUpOnCurrencyPairs Lambda every 5 minute
    const timeLimitInSeconds = 600;
    const executionFrequency = 5;
    const upholdURL = 'https://api.uphold.com/v0/ticker/';
    const cryptoCronJobRule = new Rule(this, 'cryptoCronJobRule', {
      ruleName: 'cryptoBotRule',
      description: 'This cron job rule will trigger a lambda',
      schedule: Schedule.rate(Duration.seconds(timeLimitInSeconds)),
      enabled: false
    });

    const currencyPairFailedToBeReceivedDLQ = new Queue(this, 'currencyPairFailedToBeReceived-DLQ', {
      retentionPeriod: Duration.days(14)
    });

    const currencyPairReceivedQueue = new Queue(this, 'currencyPairReceived-Queue', {
      visibilityTimeout: Duration.seconds(300),
      retentionPeriod: Duration.seconds(700),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: currencyPairFailedToBeReceivedDLQ
      }
    });

    //2. initiateLookUpOnCurrencyPairs Lambda will send data to SQS every 5 seconds for 5 minutes.
    const initiateLookUpOnCurrencyPairs = new NodejsFunction(
      this,
      'initiateLookUpOnCurrencyPairs',
      {
        entry: join('lambdas', 'initiateLookUpOnCurrencyPairs', 'handler.ts'),
        runtime: Runtime.NODEJS_14_X,
        handler: 'handler',
        memorySize: 524,
        timeout: Duration.seconds(timeLimitInSeconds),
        environment: {
          CURRENCY_PAIR_LIST: 'BTC-USD,LTC-USD',
          QUEUE_URL: currencyPairReceivedQueue.queueUrl,
          TIME_LIMIT: timeLimitInSeconds.toString(),
          EXEC_FREQUENCY: executionFrequency.toString(),
          UPHOLD_URL: upholdURL
        },
        logRetention: RetentionDays.ONE_DAY,
      }
    );

    cryptoCronJobRule.addTarget(new LambdaFunction(initiateLookUpOnCurrencyPairs));

    currencyPairReceivedQueue.grantSendMessages(initiateLookUpOnCurrencyPairs);

    //3. getCurrencyPairInformationFromUphold Lambda will save data into Aurora PostGreSql database.
    const getCurrencyPairInformationFromUphold = new NodejsFunction(
      this,
      'getCurrencyPairInformationFromUphold',
      {
        entry: join('lambdas', 'getCurrencyPairInformationFromUphold', 'handler.ts'),
        runtime: Runtime.NODEJS_14_X,
        handler: 'handler',
        environment: {
          CLUSTER_ARN: cluster.clusterArn,
          SECRET_ARN: cluster.secret?.secretArn || '',
          DB_NAME: 'CryptoBotDB',
          UPHOLD_URL: upholdURL
        },
        logRetention: RetentionDays.ONE_DAY,
      }
    );
    currencyPairReceivedQueue.grantConsumeMessages(getCurrencyPairInformationFromUphold);
    getCurrencyPairInformationFromUphold.addEventSource(new SqsEventSource(currencyPairReceivedQueue, { }));
    cluster.grantDataApiAccess(getCurrencyPairInformationFromUphold);
  }
}
