import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';
import { useCosmosKit } from './useCosmosKit';

export function useCosmWasmClient(injectedChainId?: ChainId) {
  const { chainId } = useChainId();
  const chainContext = useCosmosKit(injectedChainId ?? chainId);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', injectedChainId ?? chainId],
    chainContext!.getCosmWasmClient,
    {
      enabled: !!(injectedChainId ?? chainId) && !!chainContext,
    },
  );

  return {
    cosmWasmClient,
  };
}
