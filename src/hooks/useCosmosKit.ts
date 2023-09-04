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
import { useChain } from './useChain';

function getChainId(chain: Chains) {
  if (isMainnet()) {
    if (chain === Chains.Kujira) {
      return COSMOS_KIT_KUJIRA_MAINNET;
    }
    if (chain === Chains.Osmosis) {
      return COSMOS_KIT_OSMOSIS_MAINNET;
    }
  }

  if (chain === Chains.Osmosis) {
    return COSMOS_KIT_OSMOSIS_TESTNET;
  }

  if (chain === Chains.Kujira) {
    return COSMOS_KIT_KUJIRA_TESTNET;
  }

  return null;
}

export function useCosmosKit(injectedChain: Chains | null = null) {
  const { chain } = useChain();

  const chainId = getChainId(Chains.Kujira);

  const cosmoskit = useChainCosmosKit(chainId || '');

  if (!chainId || !featureFlags.cosmoskitEnabled) {
    return null;
  }

  return cosmoskit;
}
