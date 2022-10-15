import { Denom } from '@hooks/usePairs';
import DenomAmount from 'src/models/DenomAmount';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion?: (value: number) => number;
  deconversion?: (value: number) => number;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value / 1000000,
  deconversion: (value: number) => value * 1000000,
};

const denoms: Record<string, DenomInfo> = {
  [Denom.Demo]: {
    name: 'DEMO',
  },
  [Denom.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
  },
  [Denom.Kuji]: {
    name: 'KUJI',

    icon: '/images/denoms/kuji.svg',
  },
  [Denom.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
  },
  [Denom.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
  },
  [Denom.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
  },
  [Denom.NBTC]: {
    name: 'NBTC',
  },
};

export class DenomValue {
  readonly denomId: Denom;

  readonly amount: number;

  readonly iconUrl?: string;

  constructor(denomAmount: DenomAmount) {
    // make this not option and handle code when loading
    this.denomId = denomAmount?.denom;
    this.amount = Number(denomAmount?.amount);
    this.iconUrl = denoms[this.denomId].icon;
  }

  toConverted() {
    return this.amount / 1000000;
  }
}

const getDenomInfo = (denom?: string) => {
  if (!denom) {
    return defaultDenom;
  }
  return {
    ...defaultDenom,
    ...denoms[denom],
  };
};

export default getDenomInfo;
