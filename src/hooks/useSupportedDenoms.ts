import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { useChain, Chains } from './useChain';
import usePairs, { allDenomsFromPairs } from './usePairs';

export function useSupportedDenoms(injectedChain?: Chains) {
  const { chain: currentChain } = useChain();

  const chain = injectedChain || currentChain;

  const { data: pairsData } = usePairs();

  const { pairs } = pairsData;

  const allDenoms = chain === Chains.Osmosis ? allDenomsFromPairs(pairs) : (SUPPORTED_DENOMS as string[]);

  return allDenoms;
}
