import { filter } from 'rambda';
import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { V2Pair, V3Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { TestnetDenomsMoonbeam } from '@models/Denom';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { PairsResponse } from 'src/interfaces/generated-osmosis/response/get_pairs';
import { PairsResponse as PairsResponseV3 } from 'src/interfaces/v2/generated/response/get_pairs';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { Pair } from 'src/interfaces/v2/generated/query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';
import { useConfig } from './useConfig';

const hiddenPairs = [
  JSON.stringify([
    'ibc/D36D2BBE441D3605EEF340EAFAC57D669880597073050A2650B1468F1634A5F5',
    'factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk',
  ]),
  JSON.stringify([
    'ibc/F33B313325B1C99B646B1B786F1EA621E3794D787B90C204C30FE1D4D45970AE',
    'factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk',
  ]),
  JSON.stringify([
    'ibc/950993C6DA64F5A60A48D65A18CAB2D8190DE2DC1B861E70E8B03C61F7D5FBDC',
    'factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk',
  ]),
];

function isPairVisible(pair: V3Pair) {
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

export function uniqueQuoteDenoms(pairs: V2Pair[] | V3Pair[] | undefined) {
  return Array.from(new Set(pairs?.map(getQuoteDenom)));
}

export function uniqueBaseDenoms(pairs: V2Pair[] | V3Pair[] | undefined) {
  return Array.from(new Set(pairs?.map(getBaseDenom)));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: DenomInfo, pairs: V2Pair[] | V3Pair[] | undefined) {
  return Array.from(
    new Set(
      filter(
        (pair: V2Pair | V3Pair) => getQuoteDenom(pair) === initialDenom.id,
        (pairs as V3Pair[]) ?? (pairs as V3Pair[]),
      ).map(getBaseDenom),
    ),
  );
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: DenomInfo, pairs: V2Pair[] | V3Pair[] | undefined) {
  return Array.from(
    new Set(
      filter(
        (pair: V2Pair | V3Pair) => getBaseDenom(pair) === resultingDenom.id,
        (pairs as V3Pair[]) ?? (pairs as V3Pair[]),
      ).map(getQuoteDenom),
    ),
  );
}

export function allDenomsFromPairs(pairs: V2Pair[] | V3Pair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => getQuoteDenom(pair)).concat(pairs?.map(getBaseDenom))));
}

export function getResultingDenoms(pairs: V2Pair[] | V3Pair[], initialDenom: DenomInfo) {
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

export function usePairsOsmosis() {
  const { getCosmWasmClient } = useCosmWasmClient();
  const { chain } = useChain();
  const config = useConfig();

  function fetchPairsRecursively(
    client: CosmWasmClient,
    startAfter = null,
    allPairs = [] as V2Pair[],
  ): Promise<V2Pair[]> {
    return client
      .queryContractSmart(config!.exchange_contract_address, {
        internal_query: {
          msg: Buffer.from(
            JSON.stringify({
              get_pairs: {
                limit: GET_PAIRS_LIMIT,
                start_after: startAfter,
              },
            }),
          ).toString('base64'),
        },
      })
      .then((result) => {
        allPairs.push(...result);
        if (result.length === GET_PAIRS_LIMIT) {
          const newStartAfter = result[result.length - 1];
          return fetchPairsRecursively(client, newStartAfter, allPairs);
        }
        return allPairs;
      });
  }

  const queryResult = useQuery<V2Pair[]>(
    ['pairs-osmosis', getCosmWasmClient],
    async () => {
      const client = await getCosmWasmClient();
      if (!client) {
        throw new Error('No client');
      }

      return fetchPairsRecursively(client);
    },
    {
      enabled: !!getCosmWasmClient && chain === Chains.Osmosis && !!config && !!config.exchange_contract_address,
      staleTime: 1000 * 60 * 5,
    },
  );

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.filter((pair) =>
        isPairVisible({
          denoms: [pair.base_denom, pair.quote_denom],
        }),
      ),
    },
  };
}

function usePairsMoonbeam() {
  const { chain } = useChain();

  if (chain === Chains.Moonbeam) {
    return {
      isLoading: false,
      data: {
        pairs: [{ denoms: [TestnetDenomsMoonbeam.WDEV, TestnetDenomsMoonbeam.SATURN] }] as Pair[],
      },
    };
  }

  return null;
}

function usePairsKujira() {
  const { getCosmWasmClient } = useCosmWasmClient();
  const { chain } = useChain();

  const queryResult = useQuery<PairsResponse>(
    ['pairs-kujira', getCosmWasmClient],
    async () => {
      const client = await getCosmWasmClient();
      if (!client) {
        throw new Error('No client');
      }

      const result = await client.queryContractSmart(getChainContractAddress(Chains.Kujira!), {
        get_pairs: {},
      });
      return result;
    },
    {
      enabled: !!getCosmWasmClient && chain === Chains.Kujira,
    },
  );

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.pairs.filter((pair) =>
        isPairVisible({
          denoms: [pair.base_denom, pair.quote_denom],
        }),
      ),
    },
    meta: {
      errorMessage: 'Error fetching pairs',
    },
  };
}

function usePairsCosmos(config: Config | undefined) {
  const { getCosmWasmClient } = useCosmWasmClient();
  const { chain } = useChain();

  async function fetchPairsRecursively(
    client: CosmWasmClient,
    startAfter = null,
    allPairs = [] as V3Pair[],
  ): Promise<V3Pair[]> {
    return client
      .queryContractSmart(getChainContractAddress(chain), {
        get_pairs: {
          limit: GET_PAIRS_LIMIT,
          start_after: startAfter,
        },
      })
      .then((result) => {
        allPairs.push(...result.pairs);

        if (result.pairs.length === GET_PAIRS_LIMIT) {
          const newStartAfter = result.pairs[result.pairs.length - 1];
          return fetchPairsRecursively(client, newStartAfter, allPairs);
        }
        return allPairs;
      });
  }

  const queryResult = useQuery<V3Pair[]>(
    ['pairs-cosmos', getCosmWasmClient],
    async () => {
      const client = await getCosmWasmClient();
      if (!client) {
        throw new Error('No client');
      }

      return fetchPairsRecursively(client);
    },
    {
      enabled: !!getCosmWasmClient && !!config && !!config?.exchange_contract_address && !!chain,
      staleTime: 1000 * 60 * 5,
    },
  );

  return {
    ...queryResult,
    data: {
      pairs: queryResult.data?.filter((pair) =>
        isPairVisible({
          denoms: pair.denoms,
        }),
      ),
    },
    meta: {
      errorMessage: 'Error fetching pairs',
    },
  };
}

export default function usePairs() {
  const { chain } = useChain();
  const config = useConfig();

  const kujiraPairsData = usePairsKujira();
  const osmosisPairsData = usePairsOsmosis();
  const comsosPairsData = usePairsCosmos(config);
  const moonbeamPairsData = usePairsMoonbeam();

  return (
    moonbeamPairsData ||
    (!!config && !!config?.exchange_contract_address
      ? comsosPairsData
      : chain === Chains.Kujira
      ? kujiraPairsData
      : osmosisPairsData)
  );
}
