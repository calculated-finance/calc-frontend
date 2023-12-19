import { useChains } from '@cosmos-kit/react';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';
import { getChainName } from '@helpers/chains';

export const useChainContext = (injectedChainId?: ChainId) => {
  const contexts = useChains(
    (process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? CHAINS : MAINNET_CHAINS).map(getChainName),
  );
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;

  return chainId ? contexts[getChainName(chainId)] : null;
};
