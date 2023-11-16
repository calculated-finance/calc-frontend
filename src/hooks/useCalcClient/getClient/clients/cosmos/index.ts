import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { Vault, VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '@models/Strategy';
import { ChainId } from '@hooks/useChain/Chains';
import { getChainContractAddress } from '@helpers/chains';
import { VaultsResponse } from 'src/interfaces/v2/generated/response/get_vaults_by_address';
import {
  EventsResponse,
  Event as GeneratedEvent,
} from 'src/interfaces/v2/generated/response/get_events_by_resource_id';
import { transformToStrategyCosmos } from './transformToStrategy';

async function fetchStrategy(
  client: CosmWasmClient,
  contractAddress: string,
  id: string | undefined,
): Promise<Strategy> {
  const result = (await client.queryContractSmart(contractAddress, {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return transformToStrategyCosmos(result.vault);
}

export const GET_EVENTS_LIMIT = 400;

async function fetchStrategyEvents(client: CosmWasmClient, contractAddress: string, id: string | undefined) {
  async function fetchEventsRecursively(
    startAfter: number | null = null,
    allEvents = [] as GeneratedEvent[],
  ): Promise<GeneratedEvent[]> {
    const result = (await client.queryContractSmart(contractAddress, {
      get_events_by_resource_id: {
        resource_id: id,
        limit: GET_EVENTS_LIMIT,
        start_after: startAfter,
      },
    } as QueryMsg)) as EventsResponse;

    const { events } = result;
    allEvents.push(...events);

    // sometimes the contract returns limit - 1 events (it's a bug),
    // so we check for a returned events length of limit and limit - 1
    if (events.length === GET_EVENTS_LIMIT || events.length === GET_EVENTS_LIMIT - 1) {
      const newStartAfter = events[events.length - 1].id;
      return fetchEventsRecursively(newStartAfter, allEvents);
    }
    return allEvents;
  }

  return fetchEventsRecursively();
}

async function fetchStrategiesByAddress(client: CosmWasmClient, contractAddress: string, userAddress: string) {
  const result = (await client.queryContractSmart(contractAddress, {
    get_vaults_by_address: {
      address: userAddress,
      limit: 1000,
    },
  })) as VaultsResponse;

  const transformedStrategies = result.vaults.map((vault) => transformToStrategyCosmos(vault) as Strategy);
  return transformedStrategies as Strategy[];
}

const GET_VAULTS_LIMIT = 100;

const fetchAllStrategies = async (client: CosmWasmClient, chainId: ChainId) => {
  const fetchVaultsRecursively = async (
    cosmWasmClient: CosmWasmClient,
    chain: ChainId,
    startAfter = null,
    allVaults = [] as Vault[],
  ): Promise<Vault[]> => {
    const result = await cosmWasmClient.queryContractSmart(getChainContractAddress(chain), {
      get_vaults: {
        limit: GET_VAULTS_LIMIT,
        start_after: startAfter,
      },
    });

    allVaults.push(...result.vaults);

    if (result.vaults.length === GET_VAULTS_LIMIT) {
      const newStartAfter = result.vaults[result.vaults.length - 1].id;
      return fetchVaultsRecursively(cosmWasmClient, chain, newStartAfter, allVaults);
    }

    return allVaults;
  };

  return fetchVaultsRecursively(client, chainId);
};

export default function getCalcClient(contractAddress: string, cosmClient: CosmWasmClient, chainId: ChainId) {
  return {
    fetchStrategy: (id: string) => fetchStrategy(cosmClient, contractAddress, id),
    fetchStrategyEvents: (id: string) => fetchStrategyEvents(cosmClient, contractAddress, id),
    fetchStrategies: (userAddress: string) => fetchStrategiesByAddress(cosmClient, contractAddress, userAddress),
    fetchAllStrategies: () => fetchAllStrategies(cosmClient, chainId),
  };
}
