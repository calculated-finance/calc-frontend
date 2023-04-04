import { create } from 'zustand';

export enum Chains {
  Kujira = 'Kujira',
  Osmosis = 'Osmosis',
}

type ChainState = {
  chain: Chains;
  setChain: (chain: Chains) => void;
};

export const useChain = create<ChainState>((set) => ({
  chain: Chains.Kujira,
  setChain: (chain: Chains) => set({ chain }),
}));
