import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { PairsResponse } from 'src/interfaces/generated/response/get_pairs';
import { Denom } from '../models/Denom';
import { Pair } from '../models/Pair';
import useQueryWithNotification from './useQueryWithNotification';

const hiddenPairs = ['kujira17w9r23r8v8r7z5lphwj99296fhlye9ej5nq3hlqw554u63m88avspdl9tc'];

function isSupportedDenom(denom: Denom) {
  return SUPPORTED_DENOMS.includes(denom);
}

// function orderAlphabetically(denoms: Denom[]) {
//   return denoms.sort((a, b) => {
//     const { name: nameA } = getDenomInfo(a);
//     return a.localeCompare(b);
//   });
// }

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom))).filter((denom) =>
    SUPPORTED_DENOMS.includes(denom),
  );
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.base_denom))).filter(isSupportedDenom);
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.quote_denom === initialDenom).map((pair) => pair.base_denom)),
  ).filter(isSupportedDenom);
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: Denom, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.base_denom === resultingDenom).map((pair) => pair.quote_denom)),
  ).filter(isSupportedDenom);
}

export default function usePairs() {
  const { client } = useWallet();

  const queryResult = useQueryWithNotification<PairsResponse>(
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
  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.pairs.filter((pair) => !hiddenPairs.includes(pair.address)),
    }
  }
}
