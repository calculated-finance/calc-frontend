import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { queryClient } from 'src/pages/_app.page';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import { Vault } from 'src/interfaces/generated/response/get_vault';

const QUERY_KEY = 'active-vaults';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export type Strategy = Vault;

export default function useStrategies() {
  const { address, client } = useWallet();

  return useQuery<VaultsResponse, Error>(
    [QUERY_KEY, address, client],
    () => {
      const result = client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vaults_by_address: {
          address,
        },
      });
      return result;
    },
    {
      enabled: !!address && !!client,
    },
  );
}
