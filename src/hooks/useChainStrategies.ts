import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { useChain } from '@cosmos-kit/react';
import { getChainContractAddress, getChainName } from '@helpers/chains';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';
import useDenoms from './useDenoms';

export default function useChainStrategies(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { chain, getCosmWasmClient } = useChain(getChainName(chainId));
  const { getDenomById } = useDenoms();

  const { data: strategies, ...other } = useQuery<Strategy[]>(
    ['strategies', chainId],
    async () => {
      const client = await getCosmWasmClient();

      return getCalcClient(getChainContractAddress(chain.chain_id as ChainId), client, getDenomById).fetchAllVaults();
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
