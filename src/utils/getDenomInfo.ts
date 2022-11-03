import { Denom } from '@models/Denom';
import DenomAmount from 'src/models/DenomAmount';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion?: (value: number) => number;
  deconversion?: (value: number) => number;
  stakeable?: boolean;
  stable?: boolean;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value / 1000000,
  deconversion: (value: number) => value * 1000000,
  stakeable: true,
  stable: false,
};

const denoms: Record<string, DenomInfo> = {
  [Denom.Demo]: {
    name: 'DEMO',
    stable: true,
  },
  [Denom.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
  },
  [Denom.Kuji]: {
    name: 'KUJI',

    icon: '/images/denoms/kuji.svg',
  },
  [Denom.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
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
    stakeable: false,
  },
  [Denom.LOCAL]: {
    name: 'Local',
    stakeable: false,
  },
};

export class DenomValue {
  readonly denomId: Denom;

  readonly amount: number;

  constructor(denomAmount: DenomAmount) {
    // make this not option and handle code when loading
    this.denomId = denomAmount?.denom;
    this.amount = Number(denomAmount?.amount);
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

export function isDenomStable(denom: Denom) {
  return getDenomInfo(denom).stable;
}

export default getDenomInfo;
