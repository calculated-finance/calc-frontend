import { useWallet } from '@hooks/useWallet';
import { queryClient } from '@helpers/test/testQueryClient';
import { VaultsResponse } from 'src/interfaces/generated/response/get_vaults_by_address';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { Vault as VaultOsmosis } from 'src/interfaces/generated-osmosis/response/get_vault';
import { getChainContractAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { useCosmWasmClient } from './useCosmWasmClient';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export type Strategy = Vault;
export type StrategyOsmosis = VaultOsmosis;

export default function useStrategies() {
  const { address } = useWallet();
  const { chain } = useChain();
  const client = useCosmWasmClient((state) => state.client);

  return useQueryWithNotification<VaultsResponse>(
    [QUERY_KEY, address, client],
    () => {
      const result = client!.queryContractSmart(getChainContractAddress(chain!), {
        get_vaults_by_address: {
          address,
          limit: 1000,
        },
      });
      return result;
    },
    {
      enabled: !!address && !!client && !!chain,
    },
  );
}
