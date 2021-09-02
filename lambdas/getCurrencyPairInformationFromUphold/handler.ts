import { SQSEvent, SQSHandler } from 'aws-lambda';
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { v4 as uuidv4 } from 'uuid';
import { getCurrencyPairInformation } from '../../shared/tools';

export const handler: SQSHandler = async (event: SQSEvent) => {
	console.log('event:', event);
	const { CLUSTER_ARN, SECRET_ARN, UPHOLD_URL, DB_NAME } = process.env;
	const { Records } = event;
	const oldCurrencyDetails = await JSON.parse(Records[0].body);
	console.log('oldCurrencyDetails: ', oldCurrencyDetails);
	const newCurrencyDetails = await getCurrencyPairInformation(UPHOLD_URL as string, oldCurrencyDetails.currencyPair);
	console.log('response:', newCurrencyDetails?.ask);
	const client = new RDSDataClient({ });
	console.log('uuidv4(): ', uuidv4());
	const priceOscillationPercentage = getPriceOscillationPercentage(parseFloat(oldCurrencyDetails?.ask), parseFloat(newCurrencyDetails?.ask as string));
	if(priceOscillationPercentage > .01) {
		const command = new ExecuteStatementCommand({
			resourceArn: CLUSTER_ARN, secretArn: SECRET_ARN,
			sql: `INSERT INTO currencyPairAlerts (id,currencyPair,interval,priceOscillationPercentage,timeOfAlert) 
			VALUES('${uuidv4()}', '${oldCurrencyDetails.currencyPair}', '${oldCurrencyDetails?.ask}-${newCurrencyDetails?.ask}', ${priceOscillationPercentage}, to_timestamp(${Date.now()} / 1000.0))`,
			database: DB_NAME,
		});
		await client.send(command);
	} 
};

export async function convertStringToJson(body: string): Promise<any> {
	return await JSON.parse(body);
}

//how to calculate: https://www.calculatorsoup.com/calculators/algebra/percent-difference-calculator.php
export function getPriceOscillationPercentage (oldAsk : number, newAsk : number ) : number {
  return ( Math.abs(oldAsk - newAsk ) /(Math.abs(oldAsk + newAsk ) / 2 )) * 100;
}





// timeIntervals: https://www.dummies.com/personal-finance/investing/time-intervals-and-trend-trading/