import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/generated/query';
import {
  Event as GeneratedEvent,
  EventData as GeneratedEventData,
} from 'src/interfaces/generated/response/get_events_by_resource_id';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export type StrategyEvent = GeneratedEvent;
export type StrategyEventData = GeneratedEventData;

export const GET_EVENTS_LIMIT = 400;

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { address } = useWallet();
  const client = useCosmWasmClient((state) => state.client);
  const chain = useChain((state) => state.chain);

  function fetchEventsRecursively(startAfter = null, allEvents = [] as StrategyEvent[]): Promise<StrategyEvent[]> {
    return client!
      .queryContractSmart(getChainContractAddress(chain), {
        get_events_by_resource_id: {
          resource_id: id,
          limit: GET_EVENTS_LIMIT,
          start_after: startAfter,
        },
      } as QueryMsg)
      .then((result) => {
        const { events } = result;
        allEvents.push(...events);

        if (events.length === GET_EVENTS_LIMIT) {
          const newStartAfter = events[events.length - 1].id;
          return fetchEventsRecursively(newStartAfter, allEvents);
        }
        return allEvents;
      });
  }

  return useQueryWithNotification<StrategyEvent[]>(
    ['strategyEvents', address, id, client],
    () => fetchEventsRecursively(),
    {
      enabled: !!address && !!client && !!id && !!enabled,
    },
  );
}
