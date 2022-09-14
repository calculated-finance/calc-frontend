import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

enum Denom {
  Demo = 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  Kuji = 'ukuji',
}

export type Pair = {
  address: string;
  base_denom: Denom;
  quote_denom: Denom;
};

type Response = {
  pairs: Pair[];
};

export default function usePairs() {
  const client = useCWClient();

  return useQuery<Response>(
    ['pairs'],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_all_pairs: {},
      }),
    {
      enabled: !!client,
    },
  );
}
