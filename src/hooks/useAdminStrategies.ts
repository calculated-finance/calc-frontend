import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChainId } from './useChain';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';
import { useCalcClient } from './useCalcClient';

const QUERY_KEY = 'get_all_vaults';

export default function useAdminStrategies() {
  const { chainId: chain } = useChainId();
  const { client } = useCalcClient(chain);

  return useQuery<Strategy[]>(
    [QUERY_KEY, chain],
    async () => {
      const result = await client!.fetchAllStrategies();
      return result.map((vault) => transformToStrategyCosmos(vault));
    },
    {
      enabled: !!chain && !!client,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
