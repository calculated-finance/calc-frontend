import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { getChainEndpoint } from '@helpers/chains';
import { Chains } from './useChain';

export const useKujira = create(
  combine(
    {
      tmClient: null as Tendermint34Client | null,
      query: null as KujiraQueryClient | null,
    },
    (set, get) => ({
      init: (chain: Chains) => {
        set({ tmClient: null, query: null });
        Tendermint34Client.create(
          new HttpBatchClient(getChainEndpoint(chain), {
            dispatchInterval: 100,
            batchSizeLimit: 200,
          }),
        )
          .then((client) => {
            set({ tmClient: client });
            const queryClient = kujiraQueryClient({ client });
            set({ query: queryClient });
          })
          .catch((err) => console.error(err));
      },
    }),
  ),
);
