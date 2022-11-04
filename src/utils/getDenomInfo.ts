import { Denom, Denoms } from '@models/Denom';
import { Coin } from 'src/interfaces/generated/response/get_vaults_by_address';
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
  [Denoms.Demo]: {
    name: 'DEMO',
    stable: true,
  },
  [Denoms.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    stakeable: false,
    stable: true,
  },
  [Denoms.Kuji]: {
    name: 'KUJI',

    icon: '/images/denoms/kuji.svg',
  },
  [Denoms.AXL]: {
    name: 'axlUSDC',
    icon: '/images/denoms/axl.svg',
    stakeable: false,
    stable: true,
  },
  [Denoms.LUNA]: {
    name: 'LUNA',
    icon: '/images/denoms/luna.svg',
  },
  [Denoms.OSMO]: {
    name: 'OSMO',
    icon: '/images/denoms/osmo.svg',
  },
  [Denoms.NBTC]: {
    name: 'NBTC',
    stakeable: false,
  },
  [Denoms.LOCAL]: {
    name: 'Local',
    stakeable: false,
  },
};

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
  return {
    ...defaultDenom,
    ...denoms[denom],
  };
};

export function isDenomStable(denom: Denom) {
  return getDenomInfo(denom).stable;
}
export function isDenomVolatile(denom: Denom) {
  return !isDenomStable(denom);
}

export default getDenomInfo;
