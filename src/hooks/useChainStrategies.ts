import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChain } from '@cosmos-kit/react';
import { getChainContractAddress, getChainInfo } from '@helpers/chains';
import { transformToStrategyCosmos } from './useCalcClient/getClient/clients/cosmos/transformToStrategy';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';

export default function useChainStrategies(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { chain, getCosmWasmClient } = useChain(getChainInfo(chainId).chainName);

  const { data: strategies, ...other } = useQuery<Strategy[]>(
    ['vaults', chainId],
    async () => {
      const client = await getCosmWasmClient();

      const calcClient = getCalcClient(
        getChainContractAddress(chain.chain_id as ChainId),
        client,
        chain.chain_id as ChainId,
      );

      const allStrategies = (await calcClient.fetchAllVaults()).map((strategy) => transformToStrategyCosmos(strategy));

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

  return {
    strategies,
    ...other,
  };
}
