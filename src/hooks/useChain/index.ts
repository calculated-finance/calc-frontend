import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum Chains {
  Kujira = 'Kujira',
  Osmosis = 'Osmosis',
}

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

export const useChain = () => {
  const result = useChainStore();

  const [data, setData] = useState<ChainState>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data || ({} as ChainState);
};
