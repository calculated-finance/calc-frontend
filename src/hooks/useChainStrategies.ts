import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { getChainContractAddress } from '@helpers/chains';
import getCalcClient from './useCalcClient/getClient/clients/cosmos';
import { ChainId } from './useChainId/Chains';
import { useChainId } from './useChainId';
import useDenoms from './useDenoms';
import { useCosmWasmClient } from './useCosmWasmClient';

export default function useChainStrategies(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);
  const { getDenomById } = useDenoms();

  const { data: strategies, ...other } = useQuery<Strategy[]>(
    ['strategies', chainId],
    () => getCalcClient(chainId, getChainContractAddress(chainId), cosmWasmClient!, getDenomById).fetchAllVaults(),
    {
      enabled: !!chainId && !!cosmWasmClient,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: `Error fetching strategies for ${chainId}`,
      },
    },
  );

  return {
    strategies,
    ...other,
  };
}
