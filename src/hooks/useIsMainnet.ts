import { MAINNET_CHAINS } from 'src/constants';
import { useChainId } from './useChain';

export function useIsMainnet() {
  const { chainId } = useChainId();

  return MAINNET_CHAINS.includes(chainId);
}
