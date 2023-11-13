import { featureFlags } from 'src/constants';
import { useMemo } from 'react';
import { useCosmosKit } from './useCosmosKit';
import { useCosmWasmClientStore } from './useCosmWasmClientStore';
import { useChain } from './useChain';

export function useCosmWasmClient() {
  const chain = useChain();
  const storedClient = useCosmWasmClientStore((state) => state.client);

  const memoedStoredClientPromise = useMemo(
    () => (storedClient ? () => Promise.resolve(storedClient) : null),
    [storedClient, chain],
  );

  const { getCosmWasmClient } = useCosmosKit(chain.chainConfig?.name) || {};

  if (featureFlags.cosmoskitEnabled) {
    return {
      getCosmWasmClient,
    };
  }

  return {
    getCosmWasmClient: memoedStoredClientPromise,
  };
}
