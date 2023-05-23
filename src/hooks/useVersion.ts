import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v1/generated/query';
import { getChainContractAddress } from '@helpers/chains';
import { Config, ConfigResponse } from 'src/interfaces/generated-osmosis/response/get_config';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export type Version = 'v1' | 'v2';

export function useVersion(): Version | undefined {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  const { data } = useQueryWithNotification<ConfigResponse>(
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
