## Welcome to Serverless Crypto Alert Bot :)

This serverless application will keep record of all inputs and 


## Instructions if you want to run this in AWS:
Step 1: install aws-cli -> https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
Step 2: npm install -g aws-cdk@latest
Step 3: Configure your AWS config : https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html
```
[default]
aws_access_key_id=********AKIAI44DH********
aws_secret_access_key=*********je7M/*********
```
Step 4: npm install
Step 5: cdk bootstrap    //this will install the cdk stack 
Step 6: cdk deploy
Step 7: Login into RDS and login into the Database to create the table:
(Sadly CDK can't create tables for RDS, so we have to manually do it... DynamoDb doesn't have this issue lol )
```
Create TABLE currencyPairAlerts (
 id text UNIQUE,
 currencyPair text,
 interval text,
 priceOscillationPercentage int,
 timeOfAlert timestamp 
);
```


that's it :) the application is already created to run when necessary :D
Also, if you choose to remove this app from AWS, then all you have to do is 'cdk destroy'



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
