import { useQuery } from '@tanstack/react-query';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from '@models/ChainId';
import { useChainId } from '@hooks/useChainId';
import { useChainContext } from '@hooks/useChainContext';

export function useCosmWasmClient(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const chainContext = useChainContext(chainId);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient | null>(
    ['cosmWasmClient', chainId],
    () => chainContext!.getCosmWasmClient(),
    {
      enabled: !!chainId && !!chainContext,
      staleTime: 1000 * 60 * 10,
    },
  );

  return {
    cosmWasmClient,
  };
}
