import { COINGECKO_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

export function mockFiatPriceHistory(coingeckoId: string) {
  const fiatCurrencyId = 'usd';
  const days = 1;
  return nock(COINGECKO_ENDPOINT)
    .get(`/coins/${coingeckoId}/market_chart?vs_currency=${fiatCurrencyId}&days=${days}`)
    .reply(200, {
      prices: [[1, 2]],
    })
    .persist();
}
