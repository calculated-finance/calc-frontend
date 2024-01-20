import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChainId } from '@hooks/useChainId';
import { useQuery } from '@tanstack/react-query';
import { ChainId } from '@models/ChainId';
import useDenoms from '@hooks/useDenoms';
import getClient, { CalcClient } from './getClient';

export function useCalcClient(injectedChainId?: ChainId) {
  const { chainId: currentChainId } = useChainId();
  const chainId = injectedChainId ?? currentChainId;
  const { cosmWasmClient } = useCosmWasmClient(chainId);
  const { getDenomById, denoms } = useDenoms();

  const { data: client, ...helpers } = useQuery<CalcClient | null>(
    ['calcClient', chainId],
    () => getClient(chainId, cosmWasmClient!, getDenomById),
    {
      enabled: !!chainId && !!cosmWasmClient && !!denoms,
      staleTime: 1000 * 60 * 10,
      meta: {
        errorMessage: 'Error fetching calc client',
      },
    },
  );

  return { client, ...helpers };
}
