import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { PairsResponse } from 'src/interfaces/generated/response/get_pairs';
import { Denom } from '../models/Denom';
import { Pair } from '../models/Pair';
import useQueryWithNotification from './useQueryWithNotification';

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom)));
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.base_denom)));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.filter((pair) => pair.quote_denom === initialDenom).map((pair) => pair.base_denom)));
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.base_denom === resultingDenom).map((pair) => pair.quote_denom)),
  );
}

export default function usePairs() {
  const { client } = useWallet();

  return useQueryWithNotification<PairsResponse>(
    ['pairs', client],
    async () => {
      const result = await client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_pairs: {},
      });
      return result;
    },
    {
      enabled: !!client,
    },
  );
}
