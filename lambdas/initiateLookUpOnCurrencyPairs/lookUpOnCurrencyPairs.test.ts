import { loopPairsToSend, handler } from './handler';

describe('Test initiateLookUpOnCurrency', () => {
  beforeAll(async () => {
    process.env.UPHOLD_URL = 'https://api.uphold.com/v0/ticker/';
  });
  
   it('loopPairsToSend function should be able to loop and sleep', async () => {
    const succeeded = await loopPairsToSend(1, ['LTC-USD'], 'https://api.uphold.com/v0/ticker/', '');
    expect(succeeded).toBe(true);
   });

  /**
  * @jest-environment node
  */
  // it('getCurrencyPairInformation function should not fail', async () => {
  //   await getCurrencyPairInformation('https://api.uphold.com/v0/ticker/', 'LTC-USD');
  //   expect(true).toBe(true);
  // });


});
