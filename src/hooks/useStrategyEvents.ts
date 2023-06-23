import { useQuery } from '@tanstack/react-query';
import { Strategy } from '../models/Strategy';
import { useChain } from './useChain';
import { StrategyEvent } from './StrategyEvent';
import { useCalcClient } from './useCalcClient';

export const GET_EVENTS_LIMIT = 400;

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { chain } = useChain();
  const client = useCalcClient(chain);

  return useQuery<StrategyEvent[]>(
    ['strategyEvents', id, client],
    () => {
      if (!client) {
        throw new Error('Client not found');
      }
      if (!id) {
        throw new Error('Strategy id not found');
      }
      return client.fetchStrategyEvents(id);
    },
    {
      enabled: !!client && !!id && !!enabled,
      meta: {
        errorMessage: 'Error fetching strategy events',
      },
    },
  );
}
