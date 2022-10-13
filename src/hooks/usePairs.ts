import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export enum Denom {
  Demo = 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  Kuji = 'ukuji',
  Fake = 'fake',
}

export type Pair = {
  address: string;
  base_denom: Denom;
  quote_denom: Denom;
};

type Response = {
  pairs: Pair[];
};

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom)));
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.base_denom)));
}

export function uniqueBaseDenomsFromQuoteDenom(quoteDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.filter((pair) => pair.quote_denom === quoteDenom).map((pair) => pair.base_denom)));
}

export function uniqueQuoteDenomsFromBaseDenom(baseDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.filter((pair) => pair.base_denom === baseDenom).map((pair) => pair.quote_denom)));
}

export default function usePairs() {
  const client = useCWClient();

  return useQuery<Response>(
    ['pairs'],
    async () => {
      const result = await client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_all_pairs: {},
      });
      console.log(result);
      return result;
    },
    {
      enabled: !!client,
    },
  );
}
