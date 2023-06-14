import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { PairsResponse } from 'src/interfaces/v2/generated/response/get_pairs';
import { Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { TestnetDenomsMoonbeam } from '@models/Denom';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';

const hiddenPairs = [
  JSON.stringify([
    'ibc/D36D2BBE441D3605EEF340EAFAC57D669880597073050A2650B1468F1634A5F5',
    'factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk',
  ]),
  JSON.stringify([
    'ibc/F33B313325B1C99B646B1B786F1EA621E3794D787B90C204C30FE1D4D45970AE',
    'factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk',
  ]),
];

function isPairVisible(pair: Pair) {
  return !hiddenPairs.includes(JSON.stringify(pair.denoms));
}

export function isSupportedDenomForDcaPlus(denom: DenomInfo) {
  return denom.enabledInDcaPlus && isDenomVolatile(denom);
}

export function orderAlphabetically(denoms: DenomInfo[]) {
  return denoms.sort((a, b) => {
    const { name: nameA } = a;
    const { name: nameB } = b;
    return nameA.localeCompare(nameB);
  });
}

export function uniqueQuoteDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.denoms[1])));
}

export function uniqueBaseDenoms(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.denoms[0])));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: DenomInfo, pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.filter((pair) => pair.denoms[1] === initialDenom.id).map((pair) => pair.denoms[0])));
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: DenomInfo, pairs: Pair[] | undefined) {
  return Array.from(
    new Set(pairs?.filter((pair) => pair.denoms[0] === resultingDenom.id).map((pair) => pair.denoms[1])),
  );
}

export function allDenomsFromPairs(pairs: Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => pair.denoms[1]).concat(pairs?.map((pair) => pair.denoms[0]))));
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
      pairs: queryResult.data?.filter(isPairVisible),
    },
  };
}


function usePairsMoonbeam() {
  const { chain } = useChain();


  if (chain === Chains.Moonbeam) {
    return {
      isLoading: false,
      data: {
        pairs: [
          {
            address: 'evm1',
            base_denom: TestnetDenomsMoonbeam.WDEV,
            quote_denom: TestnetDenomsMoonbeam.SATURN,
          },
        ],
      },
    };
  }

  return null;


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

  if (chain === Chains.Moonbeam) {
    return {
      isLoading: false,
      data: {
        pairs: [
          {
            address: 'evm1',
            base_denom: TestnetDenomsMoonbeam.WDEV,
            quote_denom: TestnetDenomsMoonbeam.SATURN,
          },
        ],
      },
    };
  }

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.pairs.filter(isPairVisible),
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
  

  return usePairsMoonbeam() || chain === Chains.Kujira ? kujiraPairsData : osmosisPairsData;
}
