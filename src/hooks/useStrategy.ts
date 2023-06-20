import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from '../models/Strategy';
import { isAddressAdmin } from './useAdmin';
import { useChain } from './useChain';
import { useCalcClient } from './useCalcClient';

export const STRATEGY_KEY = 'strategy';

export default function useStrategy(id: Strategy['id'] | undefined) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCalcClient(chain);

  return useQuery<Strategy>(
    [STRATEGY_KEY, id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      if (!id) {
        throw new Error('No id');
      }
      if (!address) {
        throw new Error('No address');
      }

      const result = await client.fetchStrategy(id);

      if (result.owner !== address && !isAddressAdmin(address)) {
        throw new Error('Strategy not found');
      }

      return result;
    },
    {
      enabled: !!client && !!id && !!address,
      meta: {
        errorMessage: 'Error fetching strategy',
      },
    },
  );
}
