import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChainId } from '@hooks/useChainId';
import { useQuery } from '@tanstack/react-query';
import { ChainId } from '@hooks/useChainId/Chains';
import getClient, { CalcClient } from './getClient';
import useDenoms from '@hooks/useDenoms';

export function useCalcClient(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);
  const { getDenomInfo } = useDenoms();

  const { data: client, ...helpers } = useQuery<CalcClient | null>(
    ['calcClient', chainId],
    () => getClient(chainId, cosmWasmClient!, getDenomInfo),
    {
      enabled: !!chainId && !!cosmWasmClient,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: 'Error fetching calc client',
      },
    },
  );

  return { client, ...helpers };
}
