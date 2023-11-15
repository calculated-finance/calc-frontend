import { useFormStore } from '@hooks/useFormStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ParsedUrlQuery } from 'querystring';
import { getChainConfig } from '@helpers/chains';
import { useCosmWasmClientStore } from '@hooks/useCosmWasmClientStore';
import { ChainId } from './Chains';
import { CHAINS } from 'src/constants';

type ChainState = {
  chain: ChainId;
  setChain: (chain: ChainId) => void;
};

export const useChainStore = create<ChainState>()(
  persist(
    (set) => ({
      chain: 'kaiyo-1',
      setChain: (chain: ChainId) => set({ chain }),
    }),
    {
      name: 'chain',
    },
  ),
);

function getChainNameFromRouterQuery(query: ParsedUrlQuery) {
  const { chain } = query;

  if (!chain) {
    return {};
  }

  if (CHAINS.includes(chain as ChainId)) {
    return { chain: chain as ChainId };
  }
  const filteredChainName = CHAINS.find((c) => (chain as string).startsWith(c as string));

  if (filteredChainName) {
    return { chain: filteredChainName, wasFiltered: true };
  }

  return {};
}

export const useChain = () => {
  const router = useRouter();
  const { chain, wasFiltered } = useMemo(() => getChainNameFromRouterQuery(router.query), [router.query]);
  const clientStore = useCosmWasmClientStore();
  const storedChain = useChainStore((state) => state.chain);
  const setStoredChain = useChainStore((state) => state.setChain);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChainState>({} as ChainState);

  const updateQueryParam = useCallback(
    (newChain: ChainId) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, chain: newChain },
      });
    },
    [router],
  );

  const updateStores = useCallback(
    (newChain: ChainId) => {
      useFormStore.setState({ forms: {} });
      useCosmWasmClientStore.setState({ client: null });
      setStoredChain(newChain);
      clientStore.updateClient(newChain);
    },
    [setStoredChain],
  );

  const setChain = useCallback(
    (newChain: ChainId) => {
      if (newChain === chain) return;
      useFormStore.setState({ forms: {} });
      useCosmWasmClientStore.setState({ client: null });
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
        setData({ chain: chain as ChainId, setChain });
      } else if (storedChain) {
        updateQueryParam(storedChain);
        setData({ chain: storedChain, setChain });
      }
      setIsLoading(false);
    }
  }, [router.isReady, setChain, chain, updateQueryParam, storedChain, updateStores, wasFiltered]);

  const chainConfig = useMemo(() => getChainConfig(data.chain)!, [data.chain]);

  return { ...(data as ChainState), chainConfig, isLoading };
};
