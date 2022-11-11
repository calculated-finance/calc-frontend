import { Denom, MainnetDenoms, TestnetDenoms } from '@models/Denom';
import { NETWORK } from 'kujira.js';
import { Coin } from 'src/interfaces/generated/response/get_vaults_by_address';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion?: (value: number) => number;
  deconversion?: (value: number) => number;
  stakeable?: boolean;
  stable?: boolean;
  coingeckoId: string;
  stakeableAndSupported?: boolean;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value / 1000000,
  deconversion: (value: number) => value * 1000000,
  stakeable: true,
  stakeableAndSupported: false,
  stable: false,
  coingeckoId: '',
};

const mainnetDenoms: Record<MainnetDenoms, DenomInfo> = {
  [MainnetDenoms.ATOM]: {
    name: 'ATOM',
    icon: '/images/denoms/atom.svg',
    stakeable: true,
    coingeckoId: 'cosmos',
  },
  [MainnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
  },
  [MainnetDenoms.Kuji]: {
    name: 'KUJI',
    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
  },
  [MainnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usd-coin',
  },
};

const testnetDenoms: Record<TestnetDenoms, DenomInfo> = {
  [TestnetDenoms.Demo]: {
    name: 'DEMO',
    stable: true,
    coingeckoId: 'evmos',
  },
  [TestnetDenoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
    coingeckoId: 'usk',
  },
  [TestnetDenoms.Kuji]: {
    name: 'KUJI',

    icon: '/images/denoms/kuji.svg',
    coingeckoId: 'kujira',
    stakeableAndSupported: true,
  },
  [TestnetDenoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
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
    stakeable: false,
    coingeckoId: 'bitcoin',
  },
};

function isMainnet() {
  return (process.env.CHAIN_ID as NETWORK) === 'kaiyo-1';
}

export const SUPPORTED_DENOMS = isMainnet() ? Object.keys(mainnetDenoms) : Object.keys(testnetDenoms);

export class DenomValue {
  readonly denomId: Denom;

  readonly amount: number;

  constructor(denomAmount: Coin) {
    // make this not option and handle code when loading
    this.denomId = denomAmount?.denom || '';
    this.amount = Number(denomAmount?.amount || 0);
  }

  toConverted() {
    return this.amount / 1000000;
  }
}

const getDenomInfo = (denom?: string) => {
  if (!denom) {
    return defaultDenom;
  }
  if (isMainnet()) {
    return {
      ...defaultDenom,
      ...mainnetDenoms[denom as MainnetDenoms],
    };
  }
  return {
    ...defaultDenom,
    ...testnetDenoms[denom as TestnetDenoms],
  };
};

export function isDenomStable(denom: Denom) {
  return getDenomInfo(denom).stable;
}
export function isDenomVolatile(denom: Denom) {
  return !isDenomStable(denom);
}

export default getDenomInfo;
