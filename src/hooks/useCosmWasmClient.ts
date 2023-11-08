import { featureFlags } from 'src/constants';
import { useMemo } from 'react';
import { useCosmosKit } from './useCosmosKit';
import { useCosmWasmClientStore } from './useCosmWasmClientStore';

export function useCosmWasmClient() {
  const storedClient = useCosmWasmClientStore((state) => state.client);

  const memoedStoredClientPromise = useMemo(
    () => (storedClient ? () => Promise.resolve(storedClient) : null),
    [storedClient],
  );

  const { getCosmWasmClient } = useCosmosKit() || {};

  if (featureFlags.cosmoskitEnabled) {
    return {
      getCosmWasmClient,
    };
  }

  return {
    getCosmWasmClient: memoedStoredClientPromise,
  };
}
