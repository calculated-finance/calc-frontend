import { useWallet } from '@hooks/useWallet';
import { QueryMsg } from 'src/interfaces/generated/query';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';
import { isAddressAdmin } from './useAdmin';
import { useChain } from './useChain';

export default function useStrategy(id?: Strategy['id']) {
  const { address, client } = useWallet();
  const chain = useChain((state) => state.chain);

  return useQueryWithNotification<VaultResponse>(
    ['strategy', id, client, address],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getChainContractAddress(chain), {
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
      enabled: !!client && !!id && !!address,
    },
  );
}
