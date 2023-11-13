import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { Strategy } from '../models/Strategy';
import { useCalcClient } from './useCalcClient';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export function useStrategies() {
  const { address } = useWallet();
  const client = useCalcClient();

  return useQuery<Strategy[]>(
    [QUERY_KEY, address, client],
    async () => {
      if (!address) {
        throw new Error('No address');
      }

      return client!.fetchStrategies(address);
    },
    {
      enabled: !!address && !!client,
      meta: {
        errorMessage: 'Error fetching strategies',
      },
    },
  );
}
