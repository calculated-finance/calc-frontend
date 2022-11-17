import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import useQueryWithNotification from './useQueryWithNotification';

const QUERY_KEY = 'active-vaults';

export type Strategy = Vault;

export default function useAdminStrategies() {
  const { address, client } = useWallet();

  return useQueryWithNotification<VaultsResponse>(
    [QUERY_KEY, address, client],
    () => {
      const result = client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vaults: {
          limit: 1000,
        },
      });
      return result;
    },
    {
      enabled: !!address && !!client,
    },
  );
}
