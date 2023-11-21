import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useChainId } from '@hooks/useChainId';
import { useQuery } from '@tanstack/react-query';
import { ChainId } from '@hooks/useChainId/Chains';
import getClient, { CalcClient } from './getClient';

export function useCalcClient(injectedChainId?: ChainId) {
  const { chainId } = useChainId();
  const { cosmWasmClient } = useCosmWasmClient(injectedChainId ?? chainId);

  const { data: client, ...other } = useQuery<CalcClient | null>(
    ['calcClient', injectedChainId ?? chainId],
    () => getClient(injectedChainId ?? chainId, cosmWasmClient!),
    {
      enabled: !!(injectedChainId ?? chainId) && !!cosmWasmClient,
      meta: {
        errorMessage: 'Error fetching calc client',
      },
    },
  );

  return { client, ...other };
}
