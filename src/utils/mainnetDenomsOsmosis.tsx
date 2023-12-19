import { MainnetDenomsOsmosis } from '@models/Denom';
import { DenomInfoWithoutId } from './DenomInfoWithoutId';

export const mainnetDenomsOsmosis: Record<MainnetDenomsOsmosis, Partial<DenomInfoWithoutId>> = {
  [MainnetDenomsOsmosis.axlUSDC]: {
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
  [MainnetDenomsOsmosis.axlUSDT]: {
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
    coingeckoId: 'wrapped-bitcoin',
    stakeable: false,
    stable: false,
    enabled: true,
    enabledInDcaPlus: true,
    minimumSwapAmount: 0.05 / 10000,
  },
  [MainnetDenomsOsmosis.nBTC]: {
    coingeckoId: 'bitcoin',
    stakeable: false,
    stable: false,
    enabled: true,
    enabledInDcaPlus: true,
    fromAtomic: (value: number) => value / 10 ** 14,
    toAtomic: (value: number) => Math.round(value * 10 ** 14),
    significantFigures: 14,
    priceFromRatio: (value: number | undefined | null) => Number(value) * 10 ** 8,
    ratioFromPrice: (value: number | undefined | null) => Number(value) / 10 ** 8,
    minimumSwapAmount: 0.05 / 10000,
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
  [MainnetDenomsOsmosis.USDC]: {
    stable: true,
  },
};
