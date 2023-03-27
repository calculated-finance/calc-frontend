import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS, DEFAULT_PAGE_SIZE } from 'src/constants';
import { QueryMsg } from 'src/interfaces/generated/query';
import {
  Event as GeneratedEvent,
  EventData as GeneratedEventData,
  EventsResponse,
} from 'src/interfaces/generated/response/get_events_by_resource_id';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';

export type StrategyEvent = GeneratedEvent;
export type StrategyEventData = GeneratedEventData;

export default function useStrategyEvents(id: Strategy['id'] | undefined, enabled = true) {
  const { address, client } = useWallet();

  return useQueryWithNotification<EventsResponse>(
    ['strategyEvents', address, id, client],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_events_by_resource_id: {
          resource_id: id,
          limit: DEFAULT_PAGE_SIZE,
        },
      } as QueryMsg),
    {
      enabled: !!address && !!client && !!id && !!enabled,
    },
  );
}
