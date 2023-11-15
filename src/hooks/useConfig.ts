import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Config, ConfigResponse } from 'src/interfaces/v2/generated/response/get_config';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export function useConfig(): Config | undefined {
  const { chain } = useChain();
  const { cosmWasmClient } = useCosmWasmClient();

  const { data: response } = useQuery<ConfigResponse>(
    ['config', chain],
    () =>
      cosmWasmClient!.queryContractSmart(getChainContractAddress(chain!), {
        get_config: {},
      }),
    {
      enabled: !!cosmWasmClient && !!chain,
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
