import { TestnetDenoms } from '@models/Denom';
import { DenomInfo } from './DenomInfo';

export const testnetDenoms: Record<TestnetDenoms, Partial<DenomInfo>> = {
  [TestnetDenoms.Demo]: {
    name: 'DEMO',
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/usdc.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
    coingeckoId: 'terra-luna',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
    coingeckoId: 'osmosis',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.NBTC]: {
    name: 'NBTC',
    stakeable: false,
    coingeckoId: 'bitcoin',
    significantFigures: 6,
    enabledInDcaPlus: true,
  },
};
