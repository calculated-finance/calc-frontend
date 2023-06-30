import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useFormStore } from '@hooks/useFormStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ParsedUrlQuery } from 'querystring';
import { getChainConfig } from '@helpers/chains';
import { Chains } from './Chains';

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
};

export const useChainStore = create<ChainState>()(
  persist(
    (set) => ({
      chain: Chains.Kujira,
      setChain: (chain: Chains) => set({ chain }),
    }),
    {
      name: 'chain',
    },
  ),
);

function getChainNameFromRouterQuery(query: ParsedUrlQuery) {
  // get chain from query
  const { chain } = query;

  // if chain is not defined, return undefined
  if (!chain) {
    return {};
  }

  // if chain is defined, check if it is a valid chain
  if (Object.values(Chains).includes(chain as Chains)) {
    return { chain: chain as Chains };
  }
  // check if chain starts with a valid chain
  const filteredChainName = Object.values(Chains).find((c) =>
    // check if c starts with chain
    (chain as string).startsWith(c as string),
  );

  if (filteredChainName) {
    return { chain: filteredChainName, wasFiltered: true };
  }

  return {};
}

export const useChain = () => {
  const router = useRouter();
  const { chain, wasFiltered } = useMemo(() => getChainNameFromRouterQuery(router.query), [router.query]);
  const storedChain = useChainStore((state) => state.chain);
  const setStoredChain = useChainStore((state) => state.setChain);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChainState>({} as ChainState);

  const updateQueryParam = useCallback(
    (newChain: Chains) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, chain: newChain },
      });
    },
    [router],
  );

  const updateStores = useCallback(
    (newChain: Chains) => {
      useFormStore.setState({ forms: {} });
      useCosmWasmClient.setState({ client: null });
      setStoredChain(newChain);
    },
    [setStoredChain],
  );

  const setChain = useCallback(
    (newChain: Chains) => {
      if (newChain === chain) return;
      useFormStore.setState({ forms: {} });
      useCosmWasmClient.setState({ client: null });
      updateStores(newChain);
      updateQueryParam(newChain);
    },
    [updateQueryParam, updateStores, chain],
  );

  useEffect(() => {
    if (router.isReady) {
      if (chain) {
        if (storedChain !== chain) {
          updateStores(chain);
        }
        if (wasFiltered) {
          updateQueryParam(chain);
        }
        setData({ chain: chain as Chains, setChain });
      } else if (storedChain) {
        updateQueryParam(storedChain);
        setData({ chain: storedChain, setChain });
      }
      setIsLoading(false);
    }
  }, [router.isReady, setChain, chain, updateQueryParam, storedChain, updateStores, wasFiltered]);

  const chainConfig = useMemo(() => getChainConfig(data.chain), [data.chain]);

  return { ...(data as ChainState), chainConfig, isLoading };
};
