import { create } from 'zustand';
import { osmosis } from 'osmojs';
import { getChainEndpoint } from '@helpers/chains';
import { Chains } from './useChain';

type IUseOsmosis = {
  query: any | null;
  init: (chain: Chains) => void;
};

export const useOsmosis = create<IUseOsmosis>()((set) => ({
  query: null,
  init: async (chain: Chains) => {
    set({ query: null });
    const { createRPCQueryClient } = osmosis.ClientFactory;
    const client = await createRPCQueryClient({ rpcEndpoint: getChainEndpoint(chain) });
    set({ query: client });
  },
}));
