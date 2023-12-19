import { any, filter } from 'rambda';
import { isDenomVolatile } from '@utils/getDenomInfo';
import { HydratedPair, Pair } from '@models/Pair';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { useChainId } from './useChainId';
import { ChainId } from './useChainId/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import useDenoms from './useDenoms';

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

function isPairVisible(denoms: string[]) {
  return !hiddenPairs.includes(JSON.stringify(denoms));
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

export function uniqueQuoteDenoms(pairs: HydratedPair[] | undefined) {
  return Array.from(new Set(pairs?.map(getQuoteDenom)));
}

export function uniqueBaseDenoms(pairs: HydratedPair[] | undefined) {
  return Array.from(new Set(pairs?.map(getBaseDenom)));
}

export function uniqueBaseDenomsFromQuoteDenom(initialDenom: DenomInfo, pairs: HydratedPair[] | undefined) {
  return Array.from(
    new Set(filter((pair: HydratedPair) => getQuoteDenom(pair).id === initialDenom.id, pairs ?? []).map(getBaseDenom)),
  );
}

export function uniqueQuoteDenomsFromBaseDenom(resultingDenom: DenomInfo, pairs: HydratedPair[] | undefined) {
  return Array.from(
    new Set(
      filter((pair: HydratedPair) => getBaseDenom(pair).id === resultingDenom.id, pairs ?? []).map(getQuoteDenom),
    ),
  );
}

export function allDenomsFromPairs(pairs: HydratedPair[] | undefined) {
  return Array.from(new Set(pairs?.map((pair) => getQuoteDenom(pair)).concat(pairs?.map(getBaseDenom))));
}

export function getResultingDenoms(pairs: HydratedPair[], initialDenom?: DenomInfo) {
  console.log({ initialDenom, pairs });
  return !initialDenom
    ? []
    : orderAlphabetically(
        Array.from(
          new Set([
            ...uniqueQuoteDenomsFromBaseDenom(initialDenom, pairs),
            ...uniqueBaseDenomsFromQuoteDenom(initialDenom, pairs),
          ]),
        ),
      );
}

export default function usePairs(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);
  const { denoms, getDenomInfo } = useDenoms();

  const { data: pairs, ...other } = useQuery<Pair[]>(
    ['pairs', chainId],
    () => {
      const calcClient = getCalcClient(getChainContractAddress(chainId), cosmWasmClient!, getDenomInfo);
      return calcClient.fetchAllPairs();
    },
    {
      enabled: !!chainId && !!cosmWasmClient,
      staleTime: 1000 * 60 * 5,
      meta: {
        errorMessage: 'Error fetching pairs',
      },
    },
  );

  return {
    pairs: pairs?.filter((pair) => isPairVisible(pair.denoms)),
    hydratedPairs:
      denoms &&
      pairs
        ?.filter((pair) => isPairVisible(pair.denoms) && !any((denom) => denom === undefined, pair.denoms))
        ?.map(
          (pair) =>
            ({
              denoms: pair.denoms.map((denom) => getDenomInfo(denom)),
            } as HydratedPair),
        )
        .filter((pair) => pair.denoms.every((denom) => !!denom)),
    ...other,
  };
}
