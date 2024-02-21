import { useQuery } from '@tanstack/react-query';
import { useCalcClient } from '@hooks/useCalcClient';
import { Strategy } from '@models/Strategy';
import { StrategyEvent } from '@models/StrategyEvent';

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { client } = useCalcClient();

  return useQuery<StrategyEvent[]>(['strategyEvents', id, client], () => client!.fetchVaultEvents(id!), {
    enabled: !!client && !!id && !!enabled,
    meta: {
      errorMessage: 'Error fetching strategy events',
    },
  });
}
