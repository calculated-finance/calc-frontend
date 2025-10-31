import { ChainContext } from '@cosmos-kit/core';
import { useChains } from '@cosmos-kit/react';
import { getChainCosmosName, getDCAContractAddress } from '@helpers/chains';
import getCalcClient from '@hooks/useCalcClient/getClient/clients/cosmos';
import useDenoms from '@hooks/useDenoms';
import { ChainId } from '@models/ChainId';
import { Strategy } from '@models/Strategy';
import { useQuery } from '@tanstack/react-query';
import { map, values } from 'rambda';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { queryClient } from 'src/pages/queryClient';

const useAllStrategies = () => {
  const chains = values(
    useChains(
      (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map((chainId) =>
        getChainCosmosName(chainId),
      ),
    ),
  );

  const { denoms, getDenomById } = useDenoms();

  const { data: strategies, ...helpers } = useQuery<Strategy[]>(
    ['all_strategies'],
    async () => {
      const fetchAllStrategies = async (chain: ChainContext) => {
        const client = await chain.getCosmWasmClient();
        const calcClient = getCalcClient(
          chain.chain.chain_id as ChainId,
          getDCAContractAddress(chain.chain.chain_id as ChainId),
          client as any,
          getDenomById,
        );
        const chainStrategies = await calcClient.fetchAllVaults();
        queryClient.setQueryData(['strategies', chain.chain.chain_id], chainStrategies);
        return chainStrategies;
      };

      return map(
        (result: PromiseSettledResult<Strategy[]>) => (result.status === 'fulfilled' ? result.value : []),
        await Promise.allSettled(chains.map(fetchAllStrategies)),
      ).flat();
    },
    {
      enabled: !!chains && !!denoms,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );

  return { strategies, ...helpers };
};

export default useAllStrategies;
