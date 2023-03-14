import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { QueryMsg } from 'src/interfaces/generated/query';
import { DcaPlusPerformanceResponse } from 'src/interfaces/generated/response/get_dca_plus_performance';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';

export default function useDcaPlusPerformance(id?: Strategy['id']) {
  const { address, client } = useWallet();

  return useQueryWithNotification<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(CONTRACT_ADDRESS, {
        get_dca_plus_performance: {
          vault_id: id,
        },
      } as QueryMsg);
      // if (result.vault.owner !== address) {
      //   throw new Error('Strategy not found');
      // }
      return result;
    },
    {
      enabled: !!client && !!id && !!address,
    },
  );
}
