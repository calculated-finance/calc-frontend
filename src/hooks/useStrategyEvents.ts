import { useQuery } from '@tanstack/react-query';
import { Strategy } from '../models/Strategy';
import { StrategyEvent } from './StrategyEvent';
import { useCalcClient } from './useCalcClient';

export const GET_EVENTS_LIMIT = 400;

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { client } = useCalcClient();

  return useQuery<StrategyEvent[]>(['strategyEvents', id, client], () => client!.fetchStrategyEvents(id!), {
    enabled: !!client && !!id && !!enabled,
    meta: {
      errorMessage: 'Error fetching strategy events',
    },
  });
}
