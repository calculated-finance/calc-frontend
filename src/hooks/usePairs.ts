import { useQueryContract } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

type Denom = {
  name: string;
  icon: string;
  conversion: (value: number) => number;
};

export const denoms: Record<string, Denom> = {
  'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo': {
    name: 'DEMO',
    icon: '/images/denoms/usk.svg',
    conversion: (value: number) => value,
  },
  ukuji: {
    name: 'KUJI',
    conversion: (value: number) => value / 1000000,
    icon: '/images/denoms/kuji.svg',
  },
};

export default function usePairs() {
  return useQueryContract({
    address: CONTRACT_ADDRESS,
    msg: {
      get_all_pairs: {},
    },
  });
}
