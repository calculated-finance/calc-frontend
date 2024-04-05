import { useIsFetching, useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/pages/queryClient';
import { Strategy } from '@models/Strategy';
import { ChainContext } from '@cosmos-kit/core';
import { ChainId } from '@models/ChainId';
import { all, any, flatten, map, values } from 'rambda';
import { useChains } from '@cosmos-kit/react';
import { getChainName, getDCAContractAddress } from '@helpers/chains';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import useDenoms from './useDenoms';
import { useWallet } from './useWallet';

const QUERY_KEY = 'get_vaults_by_address';

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

function useChainStrategies(chain: ChainContext) {
  const { connected } = useWallet();
  const { getDenomById } = useDenoms();

  return useQuery<Strategy[]>(
    [QUERY_KEY, chain.address],
    async () => {
      const client = await chain.getCosmWasmClient();
      const calcClient = getCalcClient(
        chain.chain.chain_id as ChainId,
        getDCAContractAddress(chain.chain.chain_id as ChainId),
        client,
        getDenomById,
      );
      const userAddress = (await chain.getOfflineSigner().getAccounts())[0].address;
      return calcClient.fetchVaults(userAddress);
    },
    {
      enabled: connected && !!chain.address,
      meta: {
        errorMessage: `Error fetching strategies for ${chain.address} on chain ${chain.chain.chain_name}`,
      },
    },
  );
}

export function useStrategies() {
  const chains = values(
    useChains((process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map(getChainName)),
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queries = chains.map((chain) => useChainStrategies(chain));
  const isLoading = any((strategy) => strategy.isLoading || strategy.isFetching, queries);
  const strategies: Strategy[] | undefined = isLoading
    ? undefined
    : flatten(map((strategy) => strategy.data ?? [], queries));

  return {
    data: strategies,
    isLoading,
  };
}
