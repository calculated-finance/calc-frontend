import { COINGECKO_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import getDenomInfo from '@utils/getDenomInfo';

export function mockFiatPrice() {
  return nock(COINGECKO_ENDPOINT)
    .get(
      `/simple/price?ids=${SUPPORTED_DENOMS.map((denom) => getDenomInfo(denom).coingeckoId).join(
        ',',
      )}&vs_currencies=usd&include_24hr_change=true`,
    )

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
