import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v1/generated/query';
import { QueryMsg as QueryMsgOsmosis } from 'src/interfaces/generated-osmosis/query';
import { DcaPlusPerformanceResponse } from 'src/interfaces/v1/generated/response/get_dca_plus_performance';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';
import { useVersion } from './useVersion';

export default function useDcaPlusPerformance(id: Strategy['id'], enabled: boolean) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);
  const version = useVersion();

  return useQueryWithNotification<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, client, address, version],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const msg =
        version === 'v2'
          ? ({
              get_vault_performance: {
                vault_id: id,
              },
            } as QueryMsgOsmosis)
          : ({
              get_dca_plus_performance: {
                vault_id: id,
              },
            } as QueryMsg);

      const result = await client.queryContractSmart(getChainContractAddress(chain!), msg);
      return result;
    },
    {
      enabled: !!client && !!id && !!address && !!enabled && !!chain && !!version,
    },
  );
}
