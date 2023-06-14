import { MainnetDenomsOsmosis } from '@models/Denom';
import { DenomInfoWithoutId } from './DenomInfoWithoutId';


export const mainnetDenomsOsmosis: Record<MainnetDenomsOsmosis, Partial<DenomInfoWithoutId>> = {
  [MainnetDenomsOsmosis.AXL]: {
    coingeckoId: 'usd-coin',
    stable: true,
  },
  [MainnetDenomsOsmosis.AVAX]: {
    coingeckoId: 'avalanche-2',
  },
  [MainnetDenomsOsmosis.wBNB]: {
    coingeckoId: 'wbnb',
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.DAI]: {
    coingeckoId: 'dai',
    stable: true,
  },
  [MainnetDenomsOsmosis.DOT]: {
    coingeckoId: 'polkadot',
  },
  [MainnetDenomsOsmosis.wETH]: {
    enabledInDcaPlus: true,
    coingeckoId: 'weth',
  },
  [MainnetDenomsOsmosis.FTM]: {
    coingeckoId: 'wrapped-fantom',
  },
  [MainnetDenomsOsmosis.IST]: {
    coingeckoId: 'inter-stable-token',
    stable: true,
  },
  [MainnetDenomsOsmosis.USDT]: {
    stable: true,
  },
  [MainnetDenomsOsmosis.ATOM]: {
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.stATOM]: {
    enabledInDcaPlus: true,
  },
  [MainnetDenomsOsmosis.wBTC]: {
    enabledInDcaPlus: true,
    coingeckoId: 'wrapped-bitcoin',
  },
  [MainnetDenomsOsmosis.PSTAKE]: {
    coingeckoId: 'pstake-finance',
  },
  [MainnetDenomsOsmosis.PEPE]: {
    coingeckoId: 'pepe',
  },
  [MainnetDenomsOsmosis.MATIC]: {
    coingeckoId: 'matic-network',
  },
};
