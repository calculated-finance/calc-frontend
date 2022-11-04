import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { QueryMsg } from 'src/interfaces/generated/query';
import {
  Event as GeneratedEvent,
  EventData as GeneratedEventData,
  EventsResponse,
} from 'src/interfaces/generated/response/get_events_by_resource_id';
import { Strategy } from './useStrategies';

export type Event = GeneratedEvent;
export type EventData = GeneratedEventData;

export default function useStrategyEvents(id: Strategy['id'] | undefined) {
  const { address, client } = useWallet();

  return useQuery<EventsResponse, Error>(
    ['strategyEvents', address, id, client],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_events_by_resource_id: {
          resource_id: id,
        },
      } as QueryMsg),
    {
      enabled: !!address && !!client && !!id,
    },
  );
}
