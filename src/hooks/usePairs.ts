import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { PairsResponse } from 'src/interfaces/v2/generated/response/get_pairs';
import { Denom } from '@models/Denom';
import { Pair } from '@models/Pair';
import { getChainContractAddress, getChainEndpoint } from '@helpers/chains';
import { useEffect, useState } from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import useQueryWithNotification from './useQueryWithNotification';
import { Chains, useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

const hiddenPairs = [
  'kujira13l8gwanf37938wgfv5yktmfzxjwaj4ysn4gl96vj78xcqqxlcrgssfl797', // not sure what this is
  'kujira1uvqk5vj9vn4gjemrp0myz4ku49aaemulgaqw7pfe0nuvfwp3gukq64r3ws', // ampLuna - usk pair
] as string[];

export function isSupportedDenomForDcaPlus(denom: Denom) {
  const { enabledInDcaPlus } = getDenomInfo(denom);
  return enabledInDcaPlus && isDenomVolatile(denom);
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

const GET_PAIRS_LIMIT = 400;

function usePairsOsmosis() {
  const client = useCosmWasmClient((state) => state.client);
  const { chain } = useChain();

  function fetchPairsRecursively(startAfter = null, allPairs = [] as Pair[]): Promise<Pair[]> {
    return client!
      .queryContractSmart(getChainContractAddress(Chains.Osmosis), {
        get_pairs: {
          limit: GET_PAIRS_LIMIT,
          start_after: startAfter,
        },
      })
      .then((result) => {
        allPairs.push(...result.pairs);

        if (result.pairs.length === GET_PAIRS_LIMIT) {
          const newStartAfter = result.pairs[result.pairs.length - 1];
          return fetchPairsRecursively(newStartAfter, allPairs);
        }
        return allPairs;
      });
  }

  const queryResult = useQueryWithNotification<Pair[]>(['pairs-osmosis', client], () => fetchPairsRecursively(), {
    enabled: !!client && chain === Chains.Osmosis,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.filter((pair) => !hiddenPairs.includes(pair.address)),
    },
  };
}

function usePairsKujira() {
  const client = useCosmWasmClient((state) => state.client);
  const { chain } = useChain();

  const queryResult = useQueryWithNotification<PairsResponse>(
    ['pairs-kujira', client],
    async () => {
      const result = await client!.queryContractSmart(getChainContractAddress(Chains.Kujira!), {
        get_pairs: {},
      });
      return result;
    },
    {
      enabled: !!client && chain === Chains.Kujira,
    },
  );

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.pairs.filter((pair) => !hiddenPairs.includes(pair.address)),
    },
  };
}

export default function usePairs() {
  const { chain } = useChain();

  const kujiraPairsData = usePairsKujira();
  const osmosisPairsData = usePairsOsmosis();

  return chain === Chains.Kujira ? kujiraPairsData : osmosisPairsData;
}
