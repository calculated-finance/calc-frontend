import { create } from 'zustand';
import * as Sentry from '@sentry/react';
import { getChainEndpoint } from '@helpers/chains';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Chains } from './useChain/Chains';

export type IUseCosmWasmClient = {
  client: CosmWasmClient | null;
  init: (chain: Chains) => void;
  updateClient: (chain: Chains) => void;
};

export const useCosmWasmClientStore = create<IUseCosmWasmClient>()((set) => ({
  client: null as CosmWasmClient | null,
  init: async (chain: Chains) => {
    set({ client: null });
    try {
      const client = await CosmWasmClient.connect(getChainEndpoint(chain));
      set({ client });
    } catch (e) {
      Sentry.captureException(e, { tags: { page: 'useCosmWasmClient' } });
    }
  },
  updateClient: async (chain: Chains) => {
    set({ client: null });
    try {
      const client = await CosmWasmClient.connect(getChainEndpoint(chain));
      set({ client });
    } catch (e) {
      Sentry.captureException(e, { tags: { page: 'useCosmWasmClient' } });
    }
  },
}));
