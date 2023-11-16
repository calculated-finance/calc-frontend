import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Config, ConfigResponse } from 'src/interfaces/v2/generated/response/get_config';
import { useChainId } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';
import { ChainId } from './useChain/Chains';

export function useConfig(injectedChainId?: ChainId): Config | undefined {
  const { chainId } = useChainId();
  const { cosmWasmClient } = useCosmWasmClient();

  const { data: response } = useQuery<ConfigResponse>(
    ['config', injectedChainId ?? chainId],
    () =>
      cosmWasmClient!.queryContractSmart(getChainContractAddress(chainId!), {
        get_config: {},
      }),
    {
      enabled: !!(injectedChainId ?? chainId) && !!cosmWasmClient,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: false,
      meta: {
        errorMessage: 'Error fetching config',
      },
    },
  );

  if (!response) {
    return undefined;
  }

  return response.config;
}
