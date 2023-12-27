import { TestnetDenoms } from '@models/Denom';
import { DenomInfo } from './DenomInfo';

export const testnetDenomsKujira: Record<TestnetDenoms, Partial<DenomInfo>> = {
  [TestnetDenoms.Demo]: {
    name: 'DEMO',
    icon: 'missing',
    stable: true,
    coingeckoId: 'usd-coin',
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stable: true,
    coingeckoId: 'usk',
  },
  [TestnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
    stakeable: true,
    enabledInDcaPlus: true,
  },
  [TestnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/usdc.svg',
    stable: true,
    coingeckoId: 'usd-coin',
  },
  [TestnetDenoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
    coingeckoId: 'terra-luna',
  },
  [TestnetDenoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
    coingeckoId: 'osmosis',
  },
  [TestnetDenoms.NBTC]: {
    name: 'NBTC',
    icon: '/images/denoms/nbtc.svg',
    coingeckoId: 'bitcoin',
    enabledInDcaPlus: true,
  },
};
