// import { HttpBatchClient, Tendermint34Client } from '@cosmjs/tendermint-rpc';
// import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
// import { create } from 'zustand';
// import { combine } from 'zustand/middleware';
// import { getChainEndpoint } from '@helpers/chains';
// import { ChainId } from './useChain/Chains';
// import { useChain } from './useChain';

// type IUseKujira = {
//   query: KujiraQueryClient | null;
//   init: () => void;
// };

// export const useKujira = () => {
//   const { chain } = useChain();

//   return create<IUseKujira>()(
//     combine(
//       {
//         query: null as KujiraQueryClient | null,
//       },
//       (set) => ({
//         init: () => {
//           setClient(set, chain);
//         },
//       }),
//     ),
//   )();
// };

// const setClient = async (set: Function, chainId: ChainId) => {
//   set({ query: null });
//   const client = await Tendermint34Client.create(
//     new HttpBatchClient(getChainEndpoint(chainId), {
//       dispatchInterval: 100,
//       batchSizeLimit: 200,
//     }),
//   );
//   const queryClient = kujiraQueryClient({ client: client as any });
//   set({ query: queryClient });
// };
