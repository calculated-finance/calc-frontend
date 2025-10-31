import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChainContext } from '@hooks/useChainContext';
import { useChainId } from '@hooks/useChainId';
import { ChainId } from '@models/ChainId';
import { useQuery } from '@tanstack/react-query';

export function useCosmWasmClient(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const chainContext = useChainContext(chainId);

  const { data: cosmWasmClient } = useQuery<CosmWasmClient>(
    ['cosmWasmClient', chainId],
    async () => (await chainContext!.getCosmWasmClient()) as any,
    {
      enabled: !!chainId && !!chainContext,
      staleTime: 1000 * 60 * 10,
    },
  );

  return {
    cosmWasmClient,
  };
}
