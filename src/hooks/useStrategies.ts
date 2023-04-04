import { useWallet } from '@hooks/useWallet';
import { queryClient } from 'src/pages/_app.page';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export type Strategy = Vault;

export default function useStrategies() {
  const { address, client } = useWallet();
  const chain = useChain((state) => state.chain);

  return useQueryWithNotification<VaultsResponse>(
    [QUERY_KEY, address, client],
    () => {
      const result = client!.queryContractSmart(getChainContractAddress(chain), {
        get_vaults_by_address: {
          address,
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
