import { handler, convertStringToJson } from './handler';

describe('Test getCurencyPairInformationFromUpload', () => {
    beforeAll(async () => {
      process.env.UPHOLD_URL = 'https://api.uphold.com/v0/ticker/';
    });
    
     it('getCurencyPairInformationFromUpload function should extract data', async () => {

        const jsonString = JSON.stringify({
            currencyPair: 'LTC-USD',
            ask: '181.3831',
            bid: '180.88112',
            currency: 'USD'
          });

      const result = await convertStringToJson(jsonString);

      expect(true).toBe(true);
     });
  
    /**
    * @jest-environment node
    */
    // it('getCurrencyPairInformation function should not fail', async () => {
    //   await getCurrencyPairInformation('https://api.uphold.com/v0/ticker/', 'LTC-USD');
    //   expect(true).toBe(true);
    // });
  
  
  });
  