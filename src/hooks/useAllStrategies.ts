import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { CHAINS, MAINNET_CHAINS } from 'src/constants';
import { useChains } from '@cosmos-kit/react';
import { getChainContractAddress, getChainName } from '@helpers/chains';
import { values } from 'rambda';
import { ChainContext } from '@cosmos-kit/core';
import { ChainId } from '@models/ChainId';
import { queryClient } from 'src/pages/queryClient';
import getCalcClient from '@hooks/useCalcClient/getClient/clients/cosmos';
import useDenoms from '@hooks/useDenoms';

const useAllStrategies = () => {
  const chains = values(
    useChains(
      (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? MAINNET_CHAINS : CHAINS).map((chainId) =>
        getChainName(chainId),
      ),
    ),
  );

  const { denoms, getDenomById } = useDenoms();

  const { data: strategies, ...helpers } = useQuery<Strategy[]>(
    ['all_vaults'],
    async () => {
      const fetchAllStrategies = async (chain: ChainContext) => {
        const client = await chain.getCosmWasmClient();
        const calcClient = getCalcClient(
          chain.chain.chain_id as ChainId,
          getChainContractAddress(chain.chain.chain_id as ChainId),
          client,
          getDenomById,
        );
        const chainStrategies = await calcClient.fetchAllVaults();
        queryClient.setQueryData(['strategies', chain.chain.chain_id], chainStrategies);
        return chainStrategies;
      };

      return (await Promise.all(chains.map(fetchAllStrategies))).flat();
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
