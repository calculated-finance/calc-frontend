import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { DcaPlusPerformanceResponse as DcaPlusPerformanceResponseGenerated } from 'src/interfaces/v2/generated/response/get_dca_plus_performance';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export type DcaPlusPerformanceResponse = DcaPlusPerformanceResponseGenerated;

export default function useDcaPlusPerformance(id: Strategy['id'], enabled: boolean) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  return useQuery<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      if (!chain) {
        throw new Error('No chain');
      }
      const msg = {
        get_vault_performance: {
          vault_id: id,
        },
      } as QueryMsg;

      const result = await client.queryContractSmart(getChainContractAddress(chain), msg);
      return result;
    },
    {
      enabled: !!client && !!id && !!address && !!enabled && !!chain,
      meta: {
        errorMessage: 'Error fetching strategy performance',
      },
    },
  );
}
