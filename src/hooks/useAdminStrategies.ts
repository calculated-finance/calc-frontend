import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress, getChainEndpoint } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';

const QUERY_KEY = 'get_vaults';

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
  const { getCosmWasmClient } = useCosmWasmClient();
  const chain = customChain || defaultChain;

  return useQuery<Strategy[]>(
    [QUERY_KEY, chain, getCosmWasmClient, customChain],
    async () => {
      const defaultClient = getCosmWasmClient && (await getCosmWasmClient());

      const storedClient = customChain ? await CosmWasmClient.connect(getChainEndpoint(customChain)) : null;

      const client = !customChain ? defaultClient : storedClient;

      if (!client) throw new Error('No client');
      if (!chain) throw new Error('No chain');
      const result = await fetchVaultsRecursively(client, chain);

      return result.map((vault) => transformToStrategyCosmos(vault));
    },
    {
      enabled: !!getCosmWasmClient && !!chain,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
