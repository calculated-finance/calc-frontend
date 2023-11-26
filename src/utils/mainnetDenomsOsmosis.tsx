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
    minimumSwapAmount: 0.05 / 1000,
  },
  [MainnetDenomsOsmosis.FTM]: {
    coingeckoId: 'wrapped-fantom',
  },
  [MainnetDenomsOsmosis.IST]: {
    coingeckoId: 'inter-stable-token',
    stable: true,
  },
  [MainnetDenomsOsmosis.AXLUSDT]: {
    coingeckoId: 'axelar-usdt',
    stable: true,
  },
  [MainnetDenomsOsmosis.USDT]: {
    coingeckoId: 'tether',
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
    minimumSwapAmount: 0.05 / 1000,
  },
  [MainnetDenomsOsmosis.LINK]: {
    minimumSwapAmount: 1e16,
    coingeckoId: 'chainlink',
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
  [MainnetDenomsOsmosis.TIA]: {
    coingeckoId: 'celestia',
  },
  [MainnetDenomsOsmosis.OSMO]: {
    stakeable: true,
  },
};
