import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChain } from '@hooks/useChain';
import { useQuery } from '@tanstack/react-query';
import getClient, { CalcClient } from './getClient';
import { ChainId } from '@hooks/useChain/Chains';
import { getChainConfig } from '@helpers/chains';

export function useCalcClient(injectedChain?: ChainId) {
  const { chainConfig } = injectedChain ? { chainConfig: getChainConfig(injectedChain) } : useChain();
  const { cosmWasmClient } = useCosmWasmClient(injectedChain);

  const { data: client, ...other } = useQuery<CalcClient | null>(
    ['calcClient', cosmWasmClient, chainConfig],
    () => {
      console.log('useCalcClient', injectedChain, cosmWasmClient, chainConfig, client);
      return getClient(chainConfig!.name, cosmWasmClient!);
    },
    {
      enabled: !!cosmWasmClient && !!chainConfig,
      retry: false,
      meta: {
        errorMessage: 'Error fetching calc client',
      },
    },
  );

  return { client, ...other };
}
