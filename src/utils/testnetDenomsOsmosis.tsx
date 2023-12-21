import { TestnetDenomsOsmosis } from '@models/Denom';
import { DenomInfoWithoutId } from './DenomInfoWithoutId';

export const testnetDenomsOsmosis: Record<TestnetDenomsOsmosis, Partial<DenomInfoWithoutId>> = {
  [TestnetDenomsOsmosis.USDC]: {
    coingeckoId: 'usd-coin',
    stable: true,
  },
  [TestnetDenomsOsmosis.MARS]: {
    coingeckoId: 'cosmos',
  },
  [TestnetDenomsOsmosis.OSMO]: {
    coingeckoId: 'osmosis',
  },
  [TestnetDenomsOsmosis.ION]: {
    coingeckoId: 'osmosis',
  },
  [TestnetDenomsOsmosis.ATOM]: {
    coingeckoId: 'cosmos',
  },
};
