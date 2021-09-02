
import axios from 'axios';
import { currencyDetails } from './currencyDetails';

export async function getCurrencyPairInformation(upholdURL: string, currencyPair: string): Promise<currencyDetails | null> {
	try {
		const response = await axios.get(`${upholdURL}${currencyPair}`);
		console.log('response.data: ', response.data);
		return response.data;
	} catch (error) {
		console.log('ERROR on call to uphold: ', error);
	}
	return null;
}

export function sleep(ms: number): Promise<PromiseConstructor> {
	return new Promise(resolve => setTimeout(resolve, ms));
}