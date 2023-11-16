import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { Strategy } from '../models/Strategy';
import { useCalcClient } from './useCalcClient';
import { useChainId } from './useChain';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export function useStrategies() {
  const { address } = useWallet();
  const { chainId } = useChainId();
  const { client } = useCalcClient(chainId);

  return useQuery<Strategy[]>([QUERY_KEY, address], () => client!.fetchStrategies(address!), {
    enabled: !!address && !!client,
    refetchInterval: 60 * 1000,
    meta: {
      errorMessage: `Error fetching strategies for ${address}`,
    },
  });
}
