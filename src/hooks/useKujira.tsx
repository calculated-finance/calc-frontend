import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js/lib/cjs/queryClient';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { getChainEndpoint } from '@helpers/chains';
import { Chains } from './useChain/Chains';

type IUseKujira = {
  query: KujiraQueryClient | null;
  init: () => void;
};

export const useKujira = create<IUseKujira>()(
  combine(
    {
      query: null as KujiraQueryClient | null,
    },
    (set) => ({
      init: () => {
        set({ query: null });
        Tendermint34Client.create(
          new HttpBatchClient(getChainEndpoint(Chains.Kujira), {
            dispatchInterval: 100,
            batchSizeLimit: 200,
          }),
        )
          .then((client) => {
            const queryClient = kujiraQueryClient({ client });
            set({ query: queryClient });
          })
          .catch((err) => console.error(err));
      },
    }),
  ),
);
