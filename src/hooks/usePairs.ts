import { filter } from 'rambda';
import getDenomInfo, { isDenomVolatile } from '@utils/getDenomInfo';
import { V2Pair, V3Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { useChainId } from './useChainId';
import { ChainId } from './useChainId/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';

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

function usePairsCosmos(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);

  const { data: pairs, ...other } = useQuery<V3Pair[]>(
    ['pairs', chainId],
    () => {
      const calcClient = getCalcClient(getChainContractAddress(chainId), cosmWasmClient!, chainId);
      return calcClient.fetchAllPairs();
    },
    {
      enabled: !!chainId && !!cosmWasmClient,
      staleTime: 1000 * 60 * 5,
    },
  );

  return {
    ...other,
    data: {
      pairs: pairs?.filter((pair) =>
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

export default function usePairs(injectedChainId?: ChainId) {
  return usePairsCosmos(injectedChainId);
}
