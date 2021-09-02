import { ScheduledHandler, ScheduledEvent } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getCurrencyPairInformation, sleep } from '../../shared/tools';

export const handler: ScheduledHandler = async (event: ScheduledEvent) => {
	console.log('Time of Scheduled Rule Start: ', event.time);
	const { CURRENCY_PAIR_LIST, QUEUE_URL, TIME_LIMIT, EXEC_FREQUENCY, UPHOLD_URL } = process.env;
	const timeLimit = parseInt(TIME_LIMIT as string);
	const executionFrequency = parseInt(EXEC_FREQUENCY as string);
	const numCalls = Math.round(timeLimit / executionFrequency);
	const currencyPairs = CURRENCY_PAIR_LIST?.split(',');
	await loopPairsToSend(numCalls, currencyPairs as [], UPHOLD_URL as string, QUEUE_URL as string);
};

export async function loopPairsToSend(numCalls: number, currencyPairs: string[], upholdURL: string, queueUrl: string): Promise<boolean> {
	for (let x = 0; x < numCalls; x++) {
		const currencyListResults = currencyPairs.map(async function (x) {
			const response = await getCurrencyPairInformation(upholdURL, x);
			return { currencyPair: x, ...response };
		});
		await sleep(4900);
		if (queueUrl !== '') {
			currencyListResults.map(async (x) => await sendMessageToSQS(JSON.stringify(await x), queueUrl));
		}
	}
	return true;
}

async function sendMessageToSQS(currencyPairDetails: string, queueUrl: string): Promise<void> {
	const sqs = new SQSClient({ });
	console.log('currencyPairDetails: ', currencyPairDetails);
	const command = new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: currencyPairDetails });
	try {
		await sqs.send(command);
	} catch (e) {
		console.log('Exception on queue', e);
	}
}

