import { useWallet } from '@hooks/useWallet';
import {
  Event as GeneratedEvent,
  EventData as GeneratedEventData,
} from 'src/interfaces/v2/generated/response/get_events_by_resource_id';
import { getChainContractAddress } from '@helpers/chains';
import { QueryMsg } from '@models/index';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from './useStrategies';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export type StrategyEvent = GeneratedEvent;
export type StrategyEventData = GeneratedEventData;

export const GET_EVENTS_LIMIT = 400;

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { address } = useWallet();
  const client = useCosmWasmClient((state) => state.client);
  const { chain } = useChain();

  function fetchEventsRecursively(startAfter = null, allEvents = [] as StrategyEvent[]): Promise<StrategyEvent[]> {
    if (!chain) throw new Error('No chain');

    if (!client) throw new Error('No client');
    return client
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

        // sometimes the contract returns limit - 1 events (it's a bug),
        // so we check for a returned events length of limit and limit - 1
        if (events.length === GET_EVENTS_LIMIT || events.length === GET_EVENTS_LIMIT - 1) {
          const newStartAfter = events[events.length - 1].id;
          return fetchEventsRecursively(newStartAfter, allEvents);
        }
        return allEvents;
      });
  }

  return useQuery<StrategyEvent[]>(['strategyEvents', address, id, client], () => fetchEventsRecursively(), {
    enabled: !!address && !!client && !!id && !!enabled && !!chain,
    meta: {
      errorMessage: 'Error fetching strategy events',
    },
  });
}
