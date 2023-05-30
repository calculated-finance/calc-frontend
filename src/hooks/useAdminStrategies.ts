import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress, getChainEndpoint } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect, useState } from 'react';
import useQueryWithNotification from './useQueryWithNotification';
import { Chains, useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

const QUERY_KEY = 'get_vaults';

export type Strategy = Vault;

const GET_VAULTS_LIMIT = 400;

function fetchVaultsRecursively(
  client: CosmWasmClient,
  chain: Chains,
  startAfter = null,
  allVaults = [] as Vault[],
): Promise<Vault[]> {
  return client!
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

  const [storedClient, setStoredClient] = useState<CosmWasmClient | null>(null);

  const chain = customChain || defaultChain;

  useEffect(() => {
    if (chain) {
      CosmWasmClient.connect(getChainEndpoint(chain)).then(setStoredClient);
    }
  }, [chain]);

  return useQueryWithNotification<Vault[]>(
    [QUERY_KEY, storedClient, chain],
    () => fetchVaultsRecursively(storedClient!, chain),
    {
      enabled: !!storedClient && !!chain,
    },
  );
}
