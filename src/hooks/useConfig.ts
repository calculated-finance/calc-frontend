import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Config, ConfigResponse } from 'src/interfaces/v2/generated/response/get_config';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export function useConfig(): Config | undefined {
  const { chain } = useChain();
  const { getCosmWasmClient } = useCosmWasmClient();

  const { data } = useQuery<ConfigResponse>(
    ['config', getCosmWasmClient],
    async () => {
      if (!getCosmWasmClient) return undefined;

      const client = await getCosmWasmClient();

      if (!client) {
        throw new Error('No client');
      }

      const result = await client.queryContractSmart(getChainContractAddress(chain!), {
        get_config: {},
      } as QueryMsg);

      return result;
    },
    {
      enabled: !!getCosmWasmClient,
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
