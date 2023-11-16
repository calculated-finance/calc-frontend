import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import getDenomInfo from '@utils/getDenomInfo';
import { useMemo } from 'react';
import { CHAINS } from 'src/constants';
import { useChainId } from './useChain';
import { ChainId } from './useChain/Chains';
import usePairs, { allDenomsFromPairs } from './usePairs';

export function useSupportedDenoms(injectedChainId?: ChainId) {
  const { chainId } = useChainId();

  const chain = injectedChainId || chainId;

  const { data: pairsData } = usePairs(chain);

  const { pairs } = pairsData;

  const allDenoms = CHAINS.includes(chain) ? allDenomsFromPairs(pairs) : (SUPPORTED_DENOMS as string[]);

  const allDenomInfos = useMemo(() => allDenoms.map((denom) => getDenomInfo(denom)), [allDenoms]);

  return allDenomInfos;
}
