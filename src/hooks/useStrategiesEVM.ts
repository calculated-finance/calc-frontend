import { useWallet } from '@hooks/useWallet';
import { queryClient } from '@helpers/test/testQueryClient';
import { Vault } from 'src/interfaces/v2/generated/response/get_vault';
import { Vault as VaultOsmosis } from 'src/interfaces/generated-osmosis/response/get_vault';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import factoryContractJson from 'src/Factory.json';
import { ETH_DCA_FACTORY_CONTRACT_ADDRESS } from 'src/constants';
import { useChain } from './useChain';
import { useMetamask } from './useMetamask';
import { Chains } from './useChain/Chains';
import { fetchStrategy } from './useStrategyEVM';

const QUERY_KEY = 'get_vaults_by_address_evm';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export type Strategy = Vault;
export type StrategyOsmosis = VaultOsmosis;

export default function useStrategiesEVM() {
  const { address } = useWallet();
  const { chain } = useChain();
  const provider = useMetamask(state => state.provider);

  

  return useQuery<Strategy[]>(
    [QUERY_KEY, address, provider],
    async () => {
      if (!provider) {
        throw new Error('No client');
      }

  const factoryContract = new ethers.Contract(ETH_DCA_FACTORY_CONTRACT_ADDRESS, factoryContractJson.abi, provider);

      const result = await factoryContract.getVaultsByAddress(address).then((ids: string[]) => Promise.all(ids.map((id: string) => fetchStrategy(id, provider))));
      
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
