import { create } from 'zustand';
import * as Sentry from '@sentry/react';
import { osmosis } from 'osmojs';
import { getChainEndpoint } from '@helpers/chains';
import { ChainId } from './useChainId/Chains';

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
      const client = await createRPCQueryClient({ rpcEndpoint: getChainEndpoint('osmosis-1') });
      set({ query: client });
    } catch (e) {
      Sentry.captureException(e, { tags: { page: 'useOsmosis' } });
    }
  },
}));
