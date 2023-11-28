import { useChain } from '@cosmos-kit/react';
import {
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
} from 'src/constants';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';

export const useChainContext = (injectedChainId?: ChainId) => {
  const { chainId: currentChainId } = useChainId();

  const chainId = injectedChainId ?? currentChainId;

  const chainContext = useChain(
    {
      'osmosis-1': COSMOS_KIT_OSMOSIS_MAINNET,
      'osmo-test-5': COSMOS_KIT_OSMOSIS_TESTNET,
      'kaiyo-1': COSMOS_KIT_KUJIRA_MAINNET,
      'harpoon-4': COSMOS_KIT_KUJIRA_TESTNET,
    }[chainId ?? 'kaiyo-1'],
  );

  return chainId ? chainContext : null;
};
