import { featureFlags } from 'src/constants';
import { useCosmosKit } from './useCosmosKit';
import { useCosmWasmClientStore } from './useCosmWasmClientStore';
import { useMemo } from 'react';

export function useCosmWasmClient() {
  const storedClient = useCosmWasmClientStore((state) => state.client);

  const memoedStoredClientPromise = useMemo(() => () => Promise.resolve(storedClient), [storedClient]);

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
