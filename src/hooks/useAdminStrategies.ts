import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChain } from './useChain';
import { ChainId } from './useChain/Chains';
import { useCosmWasmClient } from './useCosmWasmClient';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';
import { isMainnet } from '@utils/isMainnet';
import { useCalcClient } from './useCalcClient';

const QUERY_KEY = 'get_all_vaults';

// async function fetchVaultsRecursively(
//   client: CosmWasmClient,
//   chain: ChainId,
//   startAfter = null,
//   allVaults = [] as Vault[],
// ): Promise<Vault[]> {
//   const result = await client.queryContractSmart(getChainContractAddress(chain), {
//     get_vaults: {
//       limit: GET_VAULTS_LIMIT,
//       start_after: startAfter,
//     },
//   });

//   allVaults.push(...result.vaults);

//   if (result.vaults.length === GET_VAULTS_LIMIT) {
//     const newStartAfter = result.vaults[result.vaults.length - 1].id;
//     return fetchVaultsRecursively(client, chain, newStartAfter, allVaults);
//   }

//   return allVaults;
// }

export default function useAdminStrategies() {
  const chains = (isMainnet() ? ['kaiyo-1', 'osmosis-1'] : ['harpoon-4', 'osmo-test-5']) as ChainId[];

  const clients = chains.map((chain) => {
    const { client } = useCalcClient(chain);
    console.log('CALCCLIENT', client);
    return client;
  });

  console.log('CHAINS', chains);
  console.log('CLIENTS', clients);

  return useQuery<Strategy[]>(
    [QUERY_KEY, chains],
    async () => {
      const result = (await Promise.all(clients.map(async (client) => client?.fetchAllStrategies()))).flat();
      return result.map((vault) => transformToStrategyCosmos(vault));
    },
    {
      enabled: !!chains && !!clients,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
