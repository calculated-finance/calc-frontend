import { useWallet } from '@hooks/useWallet';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { Chains } from '@hooks/useChain/Chains';
import { useMetamask } from '@hooks/useMetamask';
import { ethers } from 'ethers';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import { Vault as VaultOsmosis } from 'src/interfaces/generated-osmosis/response/get_vault';
import factoryContractJson from 'src/interfaces/evm/Factory.json';
import { useCosmWasmClient } from './useCosmWasmClient';
import { useChain } from './useChain';
import { Strategy } from '../models/Strategy';
import { fetchStrategyEVM } from './useCalcClient/getClient/clients/evm';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export function useStrategiesCosmos() {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  return useQuery<Strategy[]>(
    [QUERY_KEY, address, client],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getChainContractAddress(chain), {
        get_vaults_by_address: {
          address,
          limit: 1000,
        },
      });
      return result?.vaults;
    },
    {
      enabled: !!address && !!client && !!chain,
      meta: {
        errorMessage: 'Error fetching strategies',
      },
    },
  );
}

export function useStrategiesEVM() {
  const { address } = useWallet();
  const { chain } = useChain();
  const provider = useMetamask((state) => state.provider);

  return useQuery<Strategy[]>(
    [QUERY_KEY, address, provider],
    async () => {
      if (!provider) {
        throw new Error('No client');
      }

      const factoryContract = new ethers.Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, factoryContractJson.abi, provider);

      const result = await factoryContract
        .getVaultsByAddress(address)
        .then((ids: string[]) => Promise.all(ids.map((id: string) => fetchStrategyEVM(id, provider))));

      return result as Strategy[];
    },
    {
      enabled: !!address && !!provider && !!chain && chain === Chains.Moonbeam,
      meta: {
        errorMessage: 'Error fetching strategies',
      },
    },
  );
}
