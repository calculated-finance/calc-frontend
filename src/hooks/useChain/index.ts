import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useFormStore } from '@hooks/useFormStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Chains } from './Chains';

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
};

// export const useChainStore = create<ChainState>()(
//   persist(
//     (set) => ({
//       chain: Chains.Kujira,
//       setChain: (chain: Chains) => set({ chain }),
//     }),
//     {
//       name: 'chain',
//     },
//   ),
// );

export const useChain = () => {
  const router = useRouter();
  const { chain } = useMemo(() => router.query, [router.query]);
  const [data, setData] = useState<ChainState>({} as ChainState);

  const setChain = useCallback((newChain: Chains) => {
    useFormStore.setState({ forms: {} });
    useCosmWasmClient.setState({ client: null });
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, chain: newChain },
    });
  }, [router]);


  useEffect(() => {
    if (!chain) {
      setChain(Chains.Kujira);
    }
    setData({ chain: chain as Chains, setChain });

  }, [setChain, chain]);


console.log(data)
  return data as ChainState
};
