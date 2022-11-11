import { COINGECKO_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

export function mockFiatPrice(coingeckoId: string) {
  return nock(COINGECKO_ENDPOINT)
    .get(`/simple/price?ids=${coingeckoId}&vs_currencies=usd`)
    .reply(200, {
      [coingeckoId]: {
        usd: 1.5,
      },
    });
}
