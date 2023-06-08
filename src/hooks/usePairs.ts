import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { PairsResponse } from 'src/interfaces/v2/generated/response/get_pairs';
import { Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';

const hiddenPairs = [
  'kujira13l8gwanf37938wgfv5yktmfzxjwaj4ysn4gl96vj78xcqqxlcrgssfl797', // not sure what this is
  'kujira1uvqk5vj9vn4gjemrp0myz4ku49aaemulgaqw7pfe0nuvfwp3gukq64r3ws', // ampLuna - usk pair
] as string[];

export function isSupportedDenomForDcaPlus(denom: DenomInfo) {
  return denom.enabledInDcaPlus && isDenomVolatile(denom);
}
export function isSupportedDenomForWeightedScale(denom: DenomInfo) {
  return true;
}

export function orderAlphabetically(denoms: DenomInfo[]) {
  return denoms.sort((a, b) => {
    const { name: nameA } = a;
    const { name: nameB } = b;
    return nameA.localeCompare(nameB);
  });
}

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom)));
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.base_denom)));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: DenomInfo, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.quote_denom === initialDenom.id).map((pair) => pair.base_denom)),
  );
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: DenomInfo, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.base_denom === resultingDenom.id).map((pair) => pair.quote_denom)),
  );
}

export function allDenomsFromPairs(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.quote_denom).concat(pairs?.map((pair) => pair.base_denom))));
}

export function getResultingDenoms(pairs: Pair[], initialDenom: DenomInfo) {
  return orderAlphabetically(
    Array.from(
      new Set([
        ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pairs),
        ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pairs),
      ]),
    ).map((denom) => getDenomInfo(denom)),
  );
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

  const queryResult = useQuery<Pair[]>(['pairs-osmosis', client], () => fetchPairsRecursively(), {
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

  const queryResult = useQuery<PairsResponse>(
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
    meta: {
      errorMessage: 'Error fetching pairs',
    },
  };
}

export default function usePairs() {
  const { chain } = useChain();

  const kujiraPairsData = usePairsKujira();
  const osmosisPairsData = usePairsOsmosis();

  return chain === Chains.Kujira ? kujiraPairsData : osmosisPairsData;
}
