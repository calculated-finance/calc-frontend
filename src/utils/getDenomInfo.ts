type Denom = {
  name: string;
  icon: string;
  conversion: (value: number) => number;
};

const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value,
};

const denoms: Record<string, Denom> = {
  'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo': {
    name: 'DEMO',
    icon: '/images/denoms/usk.svg',
    conversion: (value: number) => value / 1000000,
  },
  ukuji: {
    name: 'KUJI',
    conversion: (value: number) => value / 1000000,
    icon: '/images/denoms/kuji.svg',
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
