import { useQuery } from '@tanstack/react-query';
import { useCWClient } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export enum Denom {
  Demo = 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  Kuji = 'ukuji',
  AXL = 'ibc/85CE72EE820A66F0ABD5EE3907A34E243E4BE2D6CFAEB4C08DF85BD6C0784FA2',
  LUNA = 'ibc/A1E1A20C1E4F2F76F301DA625CC476FBD0FCD8CA94DAF60814CA5257B6CD3E3E',
  OSMO = 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
  USK = 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
  NBTC = 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
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
      return result;
    },
    {
      enabled: !!client,
    },
  );
}
