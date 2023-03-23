import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import useQueryWithNotification from './useQueryWithNotification';

const QUERY_KEY = 'get_vaults';

export type Strategy = Vault;

const GET_VAULTS_LIMIT = 400;
export default function useAdminStrategies() {
  const { client } = useWallet();

  function fetchVaultsRecursively(startAfter = null, allVaults = [] as Vault[]): Promise<Vault[]> {
    return client!
      .queryContractSmart(CONTRACT_ADDRESS, {
        get_vaults: {
          limit: GET_VAULTS_LIMIT,
          start_after: startAfter,
        },
      })
      .then((result) => {
        allVaults.push(...result.vaults);

        if (result.vaults.length === GET_VAULTS_LIMIT) {
          const newStartAfter = result.vaults[result.vaults.length - 1].id;
          return fetchVaultsRecursively(newStartAfter, allVaults);
        }
        return allVaults;
      });
  }

  return useQueryWithNotification<Vault[]>([QUERY_KEY, client], () => fetchVaultsRecursively(), {
    enabled: !!client,
  });
}
