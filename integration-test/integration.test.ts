import { getCurrencyPairInformation } from '../shared/tools';

describe('Test Integration', () => {

  /**
  * @jest-environment node
  */
  it('Test UpHold API is working', async () => {
    const response = await getCurrencyPairInformation('https://api.uphold.com/v0/ticker/', 'LTC-USD');
    expect(response).toBeTruthy();
  });
});