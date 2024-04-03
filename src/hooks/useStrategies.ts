import { useWallet } from '@hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/pages/queryClient';
import { Strategy } from '@models/Strategy';
import { ChainContext } from '@cosmos-kit/core';
import { ChainId } from '@models/ChainId';
import { flatten, map, values } from 'rambda';
import { useChains } from '@cosmos-kit/react';
import { getChainName, getDCAContractAddress } from '@helpers/chains';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import useDenoms from './useDenoms';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export function useStrategies() {
  const { address } = useWallet();
  const { getDenomById } = useDenoms();
  const chains = values(
    useChains((process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map(getChainName)),
  );

  return useQuery<Strategy[]>(
    [QUERY_KEY, address],
    async () => {
      const fetchAllStrategies = async (chain: ChainContext) => {
        try {
          const client = await chain.getCosmWasmClient();
          const calcClient = getCalcClient(
            chain.chain.chain_id as ChainId,
            getDCAContractAddress(chain.chain.chain_id as ChainId),
            client,
            getDenomById,
          );
          const userAddress = (await chain.getOfflineSigner().getAccounts())[0].address;
          return await calcClient.fetchVaults(userAddress);
        } catch (error) {
          return [];
        }
      };

      return flatten(await Promise.all(chains.map(fetchAllStrategies)));
    },
    {
      enabled: !!address && !!chains,
      refetchInterval: 1000 * 60,
      meta: {
        errorMessage: `Error fetching strategies for ${address}`,
      },
    },
  );
}
