import { useChain } from '@cosmos-kit/react';
import {
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
} from 'src/constants';
import { ChainId } from './useChain/Chains';

export const useCosmosKit = (chainId: ChainId) => {
  const chainContext = useChain(
    {
      'osmosis-1': COSMOS_KIT_OSMOSIS_MAINNET,
      'osmo-test-5': COSMOS_KIT_OSMOSIS_TESTNET,
      'kaiyo-1': COSMOS_KIT_KUJIRA_MAINNET,
      'harpoon-4': COSMOS_KIT_KUJIRA_TESTNET,
    }[chainId ?? 'harpoon-4'],
  );

  return chainId ? chainContext : null;
};
