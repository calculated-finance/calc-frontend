import { useQuery } from '@tanstack/react-query';
import { Strategy } from '@models/Strategy';
import { getDCAContractAddress } from '@helpers/chains';
import { ChainId } from '@models/ChainId';
import { useChainId } from '@hooks/useChainId';
import getCalcClient from '@hooks/useCalcClient/getClient/clients/cosmos';
import useDenoms from '@hooks/useDenoms';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';

export default function useChainStrategies(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);
  const { getDenomById } = useDenoms();

  const { data: strategies, ...other } = useQuery<Strategy[]>(
    ['strategies', chainId],
    () => getCalcClient(chainId, getDCAContractAddress(chainId), cosmWasmClient!, getDenomById).fetchAllVaults(),
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
