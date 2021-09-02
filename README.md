## Welcome to Serverless Crypto Alert Bot :)

This serverless application uses the Uphold API public ticker and retrieves the BTC-USD (and other currency pairs concurrently) at a rate of 5
seconds. Each time it retrieve a new ask price, the bot will compare it with the first ask price
and decide if it should alert of an oscillation. It will alert if the price changes 0.01 percent in either
direction (price goes up or down). These alerts are stored in an Aurora PostGres Database.

![image](https://user-images.githubusercontent.com/4098471/131808981-3ce79309-c675-4b3d-af9c-640a76c2c42a.png)

## If you want to test locally

Note: you can't really run serverless locally, but you can mock and use unit tests to validate that it will work in AWS :)

1. npm install
2. npm run -s test
3. npm run -s test-all

test-all will give the code coverage report as an HTML

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
 priceOscillationPercentage float,
 timeOfAlert timestamp 
);
```


that's it :) the application is already created to run when necessary :D

should be able to see the alerts in PostGreSQL
![image](https://user-images.githubusercontent.com/4098471/131809659-de31400b-9918-4b61-a8bb-66e32584eec9.png)

![image](https://user-images.githubusercontent.com/4098471/131809793-17bbed5c-7766-4abf-b291-0b837fc72b57.png)

Also, if you choose to remove this app from AWS, then all you have to do is 'cdk destroy'

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
