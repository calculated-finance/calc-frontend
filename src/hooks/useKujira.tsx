import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { getChainEndpoint } from '@helpers/chains';
import { Chains } from './useChain';
// import { osmosis } from 'osmojs';
// import { StargateClient } from '@cosmjs/stargate';
// import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

// const getOsmosisClient = async (chain: Chains) => {
//   const { createRPCQueryClient } = osmosis.ClientFactory;
//   const client = await createRPCQueryClient({ rpcEndpoint: getChainEndpoint(chain) });
//   return client;
// };

type IUseKujira = {
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
  init: (chain: Chains) => void;
};

export const useKujira = create<IUseKujira>()(
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

// export const useKujira = create<{
//   query: CosmWasmClient | null;
//   kujiraClient: KujiraQueryClient | null;
//   osmosisClient: any;
// }>((set, get) => ({
//   query: null,
//   kujiraClient: null,
//   osmosisClient: null,
//   init: async (chain: Chains) => {
//     set({ query: null });
//     try {
//       const kujiraClient = await getKujiraClient(chain);
//       set({ kujiraClient });

//       const osmosisClient = await getOsmosisClient(chain);
//       set({ osmosisClient });

//       const queryClient = await CosmWasmClient.connect(getChainEndpoint(chain));
//       set({ query: queryClient });
//     } catch (err) {
//       console.error(err);
//     }
//   },
// }));
