import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { useChains } from '@cosmos-kit/react';
import { getChainContractAddress, getChainInfo } from '@helpers/chains';
import { values } from 'rambda';
import { ChainContext } from '@cosmos-kit/core';
import { queryClient } from 'src/pages/queryClient';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChainId/Chains';
import useDenoms from './useDenoms';

export default function useAllStrategies() {
  const chains = values(
    useChains(
      (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map(
        (chainId) => getChainInfo(chainId).chainName,
      ),
    ),
  );

  const { denoms, getDenomById } = useDenoms();

  return useQuery<Strategy[]>(
    ['all_vaults'],
    async () => {
      const fetchAllStrategies = async (chain: ChainContext) => {
        const client = await chain.getCosmWasmClient();
        const calcClient = getCalcClient(
          getChainContractAddress(chain.chain.chain_id as ChainId),
          client,
          getDenomById,
        );
        const allStrategies = await calcClient.fetchAllVaults();
        queryClient.setQueryData(['vaults', chain.chain.chain_id], allStrategies);
        return allStrategies;
      };

      return (await Promise.all(chains.map(fetchAllStrategies))).flat();
    },
    {
      enabled: !!chains && !!denoms,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
