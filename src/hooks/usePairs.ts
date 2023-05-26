import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { SUPPORTED_DENOMS_FOR_DCA_PLUS } from '@utils/SUPPORTED_DENOMS';
import { PairsResponse } from 'src/interfaces/v1/generated/response/get_pairs';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

const hiddenPairs = [] as string[];

export function isSupportedDenomForDcaPlus(denom: Denom) {
  return SUPPORTED_DENOMS_FOR_DCA_PLUS.includes(denom) && isDenomVolatile(denom);
}
export function isSupportedDenomForWeightedScale(denom: Denom) {
  return true;
}

function orderAlphabetically(denoms: Denom[]) {
  return denoms.sort((a, b) => {
    const { name: nameA } = getDenomInfo(a);
    const { name: nameB } = getDenomInfo(b);
    return nameA.localeCompare(nameB);
  });
}

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return orderAlphabetically(Array.from(new Set(pairs?.map((pair) => pair.quote_denom))));
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return orderAlphabetically(Array.from(new Set(pairs?.map((pair) => pair.base_denom))));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: Denom | undefined, pairs: Pair[] | undefined) {
  return orderAlphabetically(
    Array.from(new Set(pairs?.filter((pair) => pair.quote_denom === initialDenom).map((pair) => pair.base_denom))),
  );
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: Denom | undefined, pairs: Pair[] | undefined) {
  return orderAlphabetically(
    Array.from(new Set(pairs?.filter((pair) => pair.base_denom === resultingDenom).map((pair) => pair.quote_denom))),
  );
}

export function allDenomsFromPairs(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom).concat(pairs?.map((pair) => pair.base_denom))));
}

export default function usePairs() {
  const client = useCosmWasmClient((state) => state.client);
  const { chain } = useChain();

  const queryResult = useQueryWithNotification<PairsResponse>(
    ['pairs', chain],
    async () => {
      const result = await client!.queryContractSmart(getChainContractAddress(chain!), {
        get_pairs: {},
      });
      return result;
    },
    {
      enabled: !!client && !!chain,
    },
  );
  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.pairs.filter((pair) => !hiddenPairs.includes(pair.address)),
    },
  };
}
