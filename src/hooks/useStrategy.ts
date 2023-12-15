import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from '../models/Strategy';
import { isAddressAdmin } from './useAdmin';
import { useCalcClient } from './useCalcClient';

export const STRATEGY_KEY = 'strategy';

export default function useStrategy(id: Strategy['id'] | null | undefined) {
  const { address } = useWallet();
  const { client } = useCalcClient();

  return useQuery<Strategy>(
    [STRATEGY_KEY, id, client, address],
    async () => {
      const result = await client!.fetchVault(id!);

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
