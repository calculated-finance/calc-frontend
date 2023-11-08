import { useChain as useChainCosmosKit } from '@cosmos-kit/react';
import { isMainnet } from '@utils/isMainnet';
import {
  COSMOS_KIT_KUJIRA_MAINNET,
  COSMOS_KIT_KUJIRA_TESTNET,
  COSMOS_KIT_OSMOSIS_MAINNET,
  COSMOS_KIT_OSMOSIS_TESTNET,
  featureFlags,
} from 'src/constants';
import { Chains } from './useChain/Chains';

function getChainId(chain: Chains) {
  return (
    isMainnet()
      ? {
          [Chains.Kujira]: COSMOS_KIT_KUJIRA_MAINNET,
          [Chains.Osmosis]: COSMOS_KIT_OSMOSIS_MAINNET,
          [Chains.Moonbeam]: null,
        }
      : {
          [Chains.Kujira]: COSMOS_KIT_KUJIRA_TESTNET,
          [Chains.Osmosis]: COSMOS_KIT_OSMOSIS_TESTNET,
          [Chains.Moonbeam]: null,
        }
  )[chain];
}

export function useCosmosKit(injectedChain: Chains | null = null) {
  const chainId = getChainId(injectedChain ?? Chains.Kujira);

  const cosmoskit = useChainCosmosKit(chainId || '');

  if (!chainId || !featureFlags.cosmoskitEnabled) {
    return null;
  }

  return cosmoskit;
}
