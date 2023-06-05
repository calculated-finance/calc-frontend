import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';
import { isAddressAdmin } from './useAdmin';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

export const STRATEGY_KEY = 'strategy';

export default function useStrategy(id?: Strategy['id']) {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  return useQuery<VaultResponse>(
    [STRATEGY_KEY, id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getChainContractAddress(chain!), {
        get_vault: {
          vault_id: id,
        },
      } as QueryMsg);
      if (result.vault.owner !== address && !isAddressAdmin(address)) {
        throw new Error('Strategy not found');
      }
      return result;
    },
    {
      enabled: !!client && !!id && !!address && !!chain,
      meta: {
        errorMessage: 'Error fetching strategy',
      },
    },
  );
}
