import { getPriceOscillationPercentage } from './handler';

describe('Test getCurrencyPairInformationFromUpload', () => {
    it('getPriceOscillationPercentage function should return correct result', async () => {
        const result = getPriceOscillationPercentage(90, 95);
        expect(result).toBe(5.405405405405405);
    });
});
