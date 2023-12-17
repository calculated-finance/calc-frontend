import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';
import { useChainContext } from './useChainContext';

export function useCosmWasmClient(injectedChainId?: ChainId) {
  const { chainId } = useChainId();
  const chainContext = useChainContext(injectedChainId ?? chainId);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', injectedChainId ?? chainId],
    () => chainContext!.getCosmWasmClient(),
    {
      enabled: !!(injectedChainId ?? chainId) && !!chainContext,
      staleTime: 1000 * 60 * 10,
    },
  );

  return {
    cosmWasmClient,
  };
}
