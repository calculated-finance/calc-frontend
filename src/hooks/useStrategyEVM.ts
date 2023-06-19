import { useQuery } from '@tanstack/react-query';
import { Vault } from 'src/interfaces/v2/generated/response/get_vaults';
import { Strategy } from './useStrategies';
import { useMetamask } from './useMetamask';
import { fetchStrategy } from './fetchStrategy';

export const STRATEGY_KEY = 'strategy-evm';


export default function useStrategyEVM(id: Strategy['id'] | undefined) {
  const provider = useMetamask(state => state.provider);

  return useQuery<Vault>(
    [STRATEGY_KEY, id, provider],
    async () => {
      if (!provider) {
        throw new Error('No client');
      }

      if (!id) {
        throw new Error('No id');
      }
      const result = await fetchStrategy(id, provider) as Vault;
      return result;
    },
    {
      enabled: !!provider && !!id,
      meta: {
        errorMessage: 'Error fetching EVM strategy',
      },
    },
  );
}
