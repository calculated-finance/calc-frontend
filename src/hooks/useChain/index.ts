import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useFormStore } from '@hooks/useFormStore';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chains } from './Chains';

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
};

export const useChainStore = create<ChainState>()(
  persist(
    (set) => ({
      chain: Chains.Kujira,
      setChain: (chain: Chains) => {
        useFormStore.setState({ forms: {} });
        useCosmWasmClient.setState({ client: null });
        return set({ chain });
      },
    }),
    {
      name: 'chain',
    },
  ),
);

export const useChain = () => {
  const router = useRouter();
  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);

  const [data, setData] = useState<ChainState>();

  useEffect(() => {
    if (router.isReady) {
      const { chain: queryParamChain, ...otherParams } = router.query;
      if (queryParamChain) {
        setChain(queryParamChain as Chains);
        router.replace({
          pathname: router.pathname,
          query: otherParams,
        });
      }
      setData({ chain, setChain });
    }
  }, [router, setChain, chain]);

  return data || ({} as ChainState);
};
