import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { getChainContractAddress } from '@helpers/chains';
import { ConfigResponse } from 'src/interfaces/generated-osmosis/response/get_config';
import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';
import { Version } from './Version';

export function useVersion(): Version | undefined {
  const { address } = useWallet();
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
      enabled: !!client && !!address && !!chain,
      meta: {
        errorMessage: 'Error fetching config',
      },
    },
  );

  if (!data) {
    return undefined;
  }

  const { config } = data;

  if (config && 'twap_period' in config) {
    return 'v2';
  }
  return 'v1';
}
