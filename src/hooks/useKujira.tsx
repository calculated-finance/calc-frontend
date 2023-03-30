import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { RPC_ENDPOINT } from 'src/constants';

export const useKujira = create(
  combine(
    {
      tmClient: null as Tendermint34Client | null,
      query: null as KujiraQueryClient | null,
    },
    (set) => ({
      init: () => {
        Tendermint34Client.create(
          new HttpBatchClient(RPC_ENDPOINT, {
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
