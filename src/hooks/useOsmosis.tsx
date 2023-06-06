import { create } from 'zustand';
import * as Sentry from '@sentry/react';
import { osmosis } from 'osmojs';
import { getChainEndpoint } from '@helpers/chains';
import { Chains } from './useChain/Chains';

type IUseOsmosis = {
  query: any | null;
  init: () => void;
};

export const useOsmosis = create<IUseOsmosis>()((set) => ({
  query: null,
  init: async () => {
    set({ query: null });
    try {
      const { createRPCQueryClient } = osmosis.ClientFactory;
      const client = await createRPCQueryClient({ rpcEndpoint: getChainEndpoint(Chains.Osmosis) });
      set({ query: client });
    } catch (e) {
      Sentry.captureException(e);
    }
  },
}));
