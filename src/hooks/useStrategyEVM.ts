import { useWallet } from '@hooks/useWallet';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { useQuery } from '@tanstack/react-query';
import vaultContractJson from 'src/Vault.json'
import { ethers } from 'ethers';
import { Strategy } from './useStrategies';
import { isAddressAdmin } from './useAdmin';
import { useChain } from './useChain';
import { useMetamask } from './useMetamask';

export const STRATEGY_KEY = 'strategy-evm';

export default function useStrategyEVM(id: Strategy['id'] | undefined) {
  const { address } = useWallet();
  const { chain } = useChain();
  const provider = useMetamask(state => state.provider);

  return useQuery<VaultResponse>(
    [STRATEGY_KEY, id, provider],
    async () => {
      if (!provider) {
        throw new Error('No client');
      }

      if (!chain) {
        throw new Error('No chain');
      }
      if (!id) {
        throw new Error('No id');
      }
try {
     console.log('id', id);
     console.log('vaultContractJson', vaultContractJson);

      const vaultContract = new ethers.Contract(id, vaultContractJson.abi, provider);

      const result = await vaultContract.getConfig();

      console.log(result);

      if (result.vault.owner !== address && !isAddressAdmin(address)) {
        throw new Error('Strategy not found');
      }
      return result;
    } catch (e) {
      console.log('error', e);
    }
    },
    {
      enabled: !!provider && !!id,
      meta: {
        errorMessage: 'Error fetching EVM strategy',
      },
    },
  );
}
