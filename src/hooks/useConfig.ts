import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Config, ConfigResponse } from 'src/interfaces/v2/generated/response/get_config';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export function useConfig(): Config | undefined {
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  const { data } = useQuery<ConfigResponse>(
    ['config', chain, client],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getChainContractAddress(chain!), {
        get_config: {},
      } as QueryMsg);

      return result;
    },
    {
      enabled: !!client && !!chain,
      meta: {
        errorMessage: 'Error fetching config',
      },
    },
  );

  if (!data) {
    return undefined;
  }

  const { config } = data;

  return config;
}
