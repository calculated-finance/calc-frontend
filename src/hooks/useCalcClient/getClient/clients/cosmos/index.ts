import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { Vault, VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Strategy } from '@models/Strategy';
import {
  EventsResponse,
  Event as GeneratedEvent,
} from 'src/interfaces/v2/generated/response/get_events_by_resource_id';
import { Pair } from '@models/Pair';
import { transformToStrategyCosmos } from './transformToStrategy';
import { DenomInfo } from '@utils/DenomInfo';
import { StrategyEvent } from '@hooks/StrategyEvent';

const GET_PAIRS_LIMIT = 200;

async function fetchAllPairs(
  contractAddress: string,
  client: CosmWasmClient,
  startAfter = null,
  allPairs = [] as Pair[],
): Promise<Pair[]> {
  const { pairs } = await client!.queryContractSmart(contractAddress, {
    get_pairs: {
      limit: GET_PAIRS_LIMIT,
      start_after: startAfter,
    },
  });

  allPairs.push(...pairs);

  if (pairs.length === GET_PAIRS_LIMIT) {
    const newStartAfter = pairs[pairs.length - 1];
    return fetchAllPairs(contractAddress, client, newStartAfter, allPairs);
  }

  return allPairs;
}

async function fetchVault(
  client: CosmWasmClient,
  contractAddress: string,
  id: string | undefined,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
): Promise<Strategy> {
  const { vault } = (await client.queryContractSmart(contractAddress, {
    get_vault: {
      vault_id: id,
    },
  } as QueryMsg)) as VaultResponse;

  return transformToStrategyCosmos(vault, getDenomInfo);
}

export const GET_EVENTS_LIMIT = 200;

async function fetchVaultEvents(
  client: CosmWasmClient,
  contractAddress: string,
  id: string | undefined,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
): Promise<StrategyEvent[]> {
  const fetchEventsRecursively = async (
    startAfter: number | null = null,
    allEvents = [] as StrategyEvent[],
  ): Promise<StrategyEvent[]> => {
    const { events } = (await client.queryContractSmart(contractAddress, {
      get_events_by_resource_id: {
        resource_id: id,
        limit: GET_EVENTS_LIMIT,
        start_after: startAfter,
      },
    } as QueryMsg)) as EventsResponse;

    allEvents.push(...events);

    if (events.length === GET_EVENTS_LIMIT || events.length === GET_EVENTS_LIMIT - 1) {
      const newStartAfter = events[events.length - 1].id;
      return fetchEventsRecursively(newStartAfter, allEvents);
    }

    return allEvents;
  };

  return fetchEventsRecursively();
}

const GET_STRATEGIES_LIMIT = 100;

async function fetchVaultsByAddress(
  client: CosmWasmClient,
  contractAddress: string,
  userAddress: string,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
): Promise<Strategy[]> {
  const fetchVaultsByAddressRecursively = async (
    startAfter = null,
    allVaults = [] as Strategy[],
  ): Promise<Strategy[]> => {
    const { vaults } = await client.queryContractSmart(contractAddress, {
      get_vaults_by_address: {
        address: userAddress,
        limit: GET_STRATEGIES_LIMIT,
        start_after: startAfter,
      },
    });

    allVaults.push(...vaults.map((v: Vault) => transformToStrategyCosmos(v, getDenomInfo)));

    if (vaults.length === GET_STRATEGIES_LIMIT) {
      const newStartAfter = vaults[vaults.length - 1].id;
      return fetchVaultsByAddressRecursively(newStartAfter, allVaults);
    }

    return allVaults;
  };

  return fetchVaultsByAddressRecursively();
}

const fetchAllVaults = async (
  client: CosmWasmClient,
  contractAddress: string,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
): Promise<Strategy[]> => {
  const fetchAllVaultsRecursively = async (startAfter = null, allVaults = [] as Strategy[]): Promise<Strategy[]> => {
    const { vaults } = await client.queryContractSmart(contractAddress, {
      get_vaults: {
        limit: GET_STRATEGIES_LIMIT,
        start_after: startAfter,
      },
    });

    allVaults.push(...vaults.map((v: Vault) => transformToStrategyCosmos(v, getDenomInfo)));

    if (vaults.length === GET_STRATEGIES_LIMIT) {
      const newStartAfter = vaults[vaults.length - 1].id;
      return fetchAllVaultsRecursively(newStartAfter, allVaults);
    }

    return allVaults;
  };

  return fetchAllVaultsRecursively();
};

export default function getCalcClient(
  contractAddress: string,
  cosmWasmClient: CosmWasmClient,
  getDenomInfo: (denom: string) => DenomInfo | undefined,
) {
  return {
    fetchAllPairs: () => fetchAllPairs(contractAddress, cosmWasmClient),
    fetchVault: (id: string) => fetchVault(cosmWasmClient, contractAddress, id, getDenomInfo),
    fetchVaultEvents: (id: string) => fetchVaultEvents(cosmWasmClient, contractAddress, id, getDenomInfo),
    fetchVaults: (userAddress: string) =>
      fetchVaultsByAddress(cosmWasmClient, contractAddress, userAddress, getDenomInfo),
    fetchAllVaults: () => fetchAllVaults(cosmWasmClient, contractAddress, getDenomInfo),
  };
}
