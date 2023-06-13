import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import * as Sentry from '@sentry/react';
import { getChainContractAddress, getChainEndpoint } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';

const QUERY_KEY = 'get_vaults';

export type Strategy = Vault;

const GET_VAULTS_LIMIT = 300;

function fetchVaultsRecursively(
  client: CosmWasmClient,
  chain: Chains,
  startAfter = null,
  allVaults = [] as Vault[],
): Promise<Vault[]> {
  return client
    .queryContractSmart(getChainContractAddress(chain), {
      get_vaults: {
        limit: GET_VAULTS_LIMIT,
        start_after: startAfter,
      },
    })
    .then((result) => {
      allVaults.push(...result.vaults);

      if (result.vaults.length === GET_VAULTS_LIMIT) {
        const newStartAfter = result.vaults[result.vaults.length - 1].id;
        return fetchVaultsRecursively(client, chain, newStartAfter, allVaults);
      }
      return allVaults;
    });
}

export default function useAdminStrategies(customChain?: Chains) {
  const { chain: defaultChain } = useChain();
  const { client: defaultClient } = useCosmWasmClient();
  const chain = customChain || defaultChain;

  const [storedClient, setStoredClient] = useState<CosmWasmClient | null>(null);

  const client = !customChain ? defaultClient : storedClient;

  useEffect(() => {
    if (customChain) {
      CosmWasmClient.connect(getChainEndpoint(customChain))
        .then(setStoredClient)
        .catch((error) => Sentry.captureException(error, { tags: { page: 'useAdminStrategies' } }));
    }
  }, [chain, customChain]);

  return useQuery<Vault[]>(
    [QUERY_KEY, storedClient, chain],
    () => {
      if (!client) throw new Error('No client');
      return fetchVaultsRecursively(client, chain);
    },
    {
      enabled: !!client && !!chain,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
