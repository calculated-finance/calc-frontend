import { create } from 'zustand';
import * as Sentry from '@sentry/react';
import { getChainEndpoint } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ChainId } from './useChainId/Chains';

export type IUseCosmWasmClient = {
  client: CosmWasmClient | null;
  init: (chain: ChainId) => void;
  updateClient: (chain: ChainId) => void;
};

export const useCosmWasmClientStore = create<IUseCosmWasmClient>()((set) => ({
  client: null as CosmWasmClient | null,
  init: async (chain: ChainId) => {
    set({ client: null });
    try {
      const client = await CosmWasmClient.connect(getChainEndpoint(chain));
      set({ client });
    } catch (e) {
      Sentry.captureException(e, { tags: { page: 'useCosmWasmClient' } });
    }
  },
  updateClient: async (chain: ChainId) => {
    set({ client: null });
    try {
      const client = await CosmWasmClient.connect(getChainEndpoint(chain));
      set({ client });
    } catch (e) {
      Sentry.captureException(e, { tags: { page: 'useCosmWasmClient' } });
    }
  },
}));
