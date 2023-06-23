import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '@models/Strategy';
import { StrategyEvent } from '@hooks/StrategyEvent';

async function fetchStrategy(client: CosmWasmClient, address: string, id: string | undefined): Promise<Strategy> {
  const result = (await client.queryContractSmart(address, {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return result.vault;
}

export const GET_EVENTS_LIMIT = 400;

async function fetchStrategyEvents(client: CosmWasmClient, address: string, id: string | undefined) {
  function fetchEventsRecursively(startAfter = null, allEvents = [] as StrategyEvent[]): Promise<StrategyEvent[]> {
    return client
      .queryContractSmart(address, {
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

  return fetchEventsRecursively();
}

export default function getCosmosClient(address: string, cosmClient: CosmWasmClient) {
  return {
    fetchStrategy: (id: string) => fetchStrategy(cosmClient, address, id),
    fetchStrategyEvents: (id: string) => fetchStrategyEvents(cosmClient, address, id),
  };
}
