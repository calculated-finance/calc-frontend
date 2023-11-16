import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { MAINNET_CHAINS } from 'src/constants';
import { useChains } from '@cosmos-kit/react';
import { getChainContractAddress, getChainInfo } from '@helpers/chains';
import { values } from 'rambda';
import { ChainContext } from '@cosmos-kit/core';
import { queryClient } from 'src/pages/queryClient';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChain/Chains';

export default function useAllMainnetStrategies() {
  const chains = values(useChains(MAINNET_CHAINS.map((chainId) => getChainInfo(chainId).chainName)));

  return useQuery<Strategy[]>(
    ['all_vaults'],
    async () => {
      const fetchAllStrategies = async (chain: ChainContext) => {
        const client = await chain.getCosmWasmClient();
        const calcClient = getCalcClient(
          getChainContractAddress(chain.chain.chain_id as ChainId),
          client,
          chain.chain.chain_id as ChainId,
        );
        const allStrategies = (await calcClient.fetchAllStrategies()).map((strategy) =>
          transformToStrategyCosmos(strategy),
        );
        queryClient.setQueryData(['vaults', chain.chain.chain_id], allStrategies);
        return allStrategies;
      };

      return (await Promise.all(chains.map(fetchAllStrategies))).flat();
    },
    {
      enabled: !!chains,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
