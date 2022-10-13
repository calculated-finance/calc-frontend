import { Denom } from '@hooks/usePairs';

type DenomInfo = {
  name: string;
  icon?: string;
  conversion: (value: number) => number;
  deconversion: (value: number) => number;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value,
  deconversion: (value: number) => value,
};

const denoms: Record<string, DenomInfo> = {
  [Denom.Demo]: {
    name: 'DEMO',
    conversion: (value: number) => value / 1000000,
    deconversion: (value: number) => value * 1000000,
  },
  [Denom.USK]: {
    name: 'USK',
    icon: '/images/denoms/usk.svg',
    conversion: (value: number) => value / 1000000,
    deconversion: (value: number) => value * 1000000,
  },
  [Denom.Kuji]: {
    name: 'KUJI',
    conversion: (value: number) => value / 1000000,
    deconversion: (value: number) => value * 1000000,

    icon: '/images/denoms/kuji.svg',
  },
  [Denom.AXL]: {
    name: 'axlUSDC',
    conversion: (value: number) => value,
    deconversion: (value: number) => value,
    icon: '/images/denoms/axl.svg',
  },
  [Denom.LUNA]: {
    name: 'LUNA',
    conversion: (value: number) => value,
    deconversion: (value: number) => value,
    icon: '/images/denoms/luna.svg',
  },
  [Denom.OSMO]: {
    name: 'OSMO',
    conversion: (value: number) => value,
    deconversion: (value: number) => value,
    icon: '/images/denoms/osmo.svg',
  },
  [Denom.NBTC]: {
    name: 'NBTC',
    conversion: (value: number) => value,
    deconversion: (value: number) => value,
  },
};

const getDenomInfo = (denom?: string) => {
  if (!denom) {
    return defaultDenom;
  }
  return {
    ...denoms[denom],
  };
};

export default getDenomInfo;
