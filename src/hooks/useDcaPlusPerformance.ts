import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v1/generated/query';
import { QueryMsg as QueryMsgOsmosis } from 'src/interfaces/generated-osmosis/query';
import { DcaPlusPerformanceResponse } from 'src/interfaces/v1/generated/response/get_dca_plus_performance';
import { getChainContractAddress } from '@helpers/chains';
import { isStrategyV2 } from '@helpers/strategy/isStrategyV2';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy, StrategyOsmosis } from './useStrategies';
import { Chains, useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export default function useDcaPlusPerformance(strategy: Strategy | StrategyOsmosis, enabled: boolean) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  const { id } = strategy;

  return useQueryWithNotification<DcaPlusPerformanceResponse>(
    ['strategy-dca-plus-performance', id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const msg = isStrategyV2(strategy)
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
      enabled: !!client && !!id && !!address && !!enabled && !!chain,
    },
  );
}
