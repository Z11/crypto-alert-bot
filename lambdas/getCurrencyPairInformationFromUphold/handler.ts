import { SQSEvent, SQSHandler } from 'aws-lambda';
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { v4 as uuidv4 } from 'uuid';
import { getCurrencyPairInformation } from '../../shared/tools';

export const handler: SQSHandler = async (event: SQSEvent) => {
	console.log('event:', event);
	const { CLUSTER_ARN, SECRET_ARN, UPHOLD_URL, DB_NAME } = process.env;
	const { Records } = event;
	const currencyDetails = await JSON.parse(Records[0].body);
	console.log('currencyDetails: ', currencyDetails);
	const { currencyPair } = currencyDetails;
	const response = await getCurrencyPairInformation(UPHOLD_URL as string, currencyPair);
	console.log('response:', response);
	const client = new RDSDataClient({});
	console.log('uuidv4(): ', uuidv4());
	const command = new ExecuteStatementCommand({
		resourceArn: CLUSTER_ARN, secretArn: SECRET_ARN,
		sql: `INSERT INTO currencyPairAlerts (id,currencyPair,interval,priceOscillationPercentage,timeOfAlert) VALUES('${ uuidv4()}', '${currencyPair}', '', 100, to_timestamp(${Date.now()} / 1000.0)`,
		database: DB_NAME,
	});
	await client.send(command);
};

export async function convertStringToJson(body: string): Promise<any> {
	return await JSON.parse(body);
}

// timeIntervals: https://www.dummies.com/personal-finance/investing/time-intervals-and-trend-trading/