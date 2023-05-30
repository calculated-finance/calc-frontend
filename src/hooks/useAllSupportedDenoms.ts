import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { useChain } from './useChain';
import { allDenomsFromPairs, useOsmosisPairs } from './usePairs';

export function useAllSupportedDenoms() {
  const { chain } = useChain();

  const { data: osmosisPairsData } = useOsmosisPairs();

  const { pairs } = osmosisPairsData;

  console.log(allDenomsFromPairs(pairs).length);
  console.log(SUPPORTED_DENOMS.length);

  const allDenoms = [...allDenomsFromPairs(pairs), ...(SUPPORTED_DENOMS as string[])];

  return allDenoms;
}
