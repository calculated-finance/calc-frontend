import { useFormStore } from '@hooks/useFormStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ParsedUrlQuery } from 'querystring';
import { getChainConfig } from '@helpers/chains';
import { CHAINS } from 'src/constants';
import { ChainId } from './Chains';

type ChainState = {
  chainId: ChainId;
  setChain: (chain: ChainId) => void;
};

export const useChainStore = create<ChainState>()(
  persist(
    (set) => ({
      chainId: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'kaiyo-1' : 'harpoon-4',
      setChain: (chain: ChainId) => set({ chainId: chain }),
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

export const useChainId = () => {
  const router = useRouter();
  const { chain, wasFiltered } = useMemo(() => getChainNameFromRouterQuery(router.query), [router.query]);
  const storedChain = useChainStore((state) => state.chainId);
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
      setStoredChain(newChain);
    },
    [setStoredChain],
  );

  const setChain = useCallback(
    (newChain: ChainId) => {
      if (newChain === chain) return;
      useFormStore.setState({ forms: {} });
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
        setData({ chainId: chain as ChainId, setChain });
      } else if (storedChain) {
        updateQueryParam(storedChain);
        setData({ chainId: storedChain, setChain });
      }
      setIsLoading(false);
    }
  }, [router.isReady, setChain, chain, updateQueryParam, storedChain, updateStores, wasFiltered]);

  const chainConfig = useMemo(() => getChainConfig(data.chainId)!, [data.chainId]);

  return { ...(data as ChainState), chainConfig, isLoading };
};
