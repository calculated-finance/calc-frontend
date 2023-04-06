import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/generated/query';
import { DcaPlusPerformanceResponse } from 'src/interfaces/generated/response/get_dca_plus_performance';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export default function useDcaPlusPerformance(id: Strategy['id'], enabled: boolean) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  return useQueryWithNotification<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getChainContractAddress(chain!), {
        get_dca_plus_performance: {
          vault_id: id,
        },
      } as QueryMsg);
      return result;
    },
    {
      enabled: !!client && !!id && !!address && !!enabled && !!chain,
    },
  );
}
