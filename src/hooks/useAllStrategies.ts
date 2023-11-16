import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChain } from '@cosmos-kit/react';
import { getChainContractAddress, getChainInfo } from '@helpers/chains';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChain/Chains';
import { useChainId } from './useChain';

export default function useAllStrategies() {
  const { chainId } = useChainId();
  const chain = useChain(getChainInfo(chainId).chainName);

  return useQuery<Strategy[]>(
    ['vaults', chainId],
    async () => {
      const client = await chain.getCosmWasmClient();

      const calcClient = getCalcClient(
        getChainContractAddress(chain.chain.chain_id as ChainId),
        client,
        chain.chain.chain_id as ChainId,
      );

      const allStrategies = (await calcClient.fetchAllStrategies()).map((strategy) =>
        transformToStrategyCosmos(strategy),
      );

      return allStrategies;
    },
    {
      enabled: !!chainId && !!chain,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      meta: {
        errorMessage: 'Error fetching all strategies',
      },
    },
  );
}
