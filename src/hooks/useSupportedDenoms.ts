import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import usePairs, { allDenomsFromPairs } from './usePairs';

export function useSupportedDenoms(injectedChain?: Chains) {
  const { chain: currentChain } = useChain();

  const chain = injectedChain || currentChain;

  const { data: pairsData } = usePairs();

  const { pairs } = pairsData;

  const allDenoms = chain !== Chains.Kujira ? allDenomsFromPairs(pairs) : (SUPPORTED_DENOMS as string[]);

  const allDenomInfos = useMemo(() => allDenoms.map((denom) => getDenomInfo(denom)), [allDenoms]);

  return allDenomInfos;
}
