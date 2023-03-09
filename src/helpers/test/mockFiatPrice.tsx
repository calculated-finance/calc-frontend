import { COINGECKO_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

export function mockFiatPrice() {
  return nock(COINGECKO_ENDPOINT)
    .get(`/simple/price?ids=usd-coin,usk,kujira,usd-coin,terra-luna,osmosis,bitcoin&vs_currencies=usd`)
    .reply(200, {
      cosmos: {
        usd: 0.5,
      },
      kujira: {
        usd: 1.5,
      },
      'usd-coin': {
        usd: 2.5,
      },
      usk: {
        usd: 3.5,
      },
    })
    .persist();
}
