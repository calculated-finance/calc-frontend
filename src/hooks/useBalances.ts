import { useWallet } from '@hooks/useWallet';
import { Coin } from '@cosmjs/stargate';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import useQueryWithNotification from './useQueryWithNotification';
import { useKujira } from './useKujira';

const useBalances = () => {
  const { address } = useWallet();
  const query = useKujira((state) => state.query);

  const { data, ...other } = useQueryWithNotification(
    ['balances', address],
    async () => query?.bank.allBalances(address!),
    {
      enabled: !!address && !!query,
      cacheTime: 0,
    },
  );

  return {
    data: {
      ...data,
      balances: data?.filter((balance: Coin) => SUPPORTED_DENOMS.includes(balance.denom)) || [],
    },
    ...other,
  };
};

export default useBalances;

// const useBalances = () => {
//   const { address } = useWallet();
//   const chain = useChain((state) => state.chain);
//   const { kujiraClient, osmosisClient } = useKujira((state) => ({
//     kujiraClient: state.kujiraClient,
//     osmosisClient: state.osmosisClient,
//   }));

//   const { data, ...other } = useQueryWithNotification(
//     ['balances', address],
//     async () => {
//       if (chain === Chains.Kujira) {
//         return kujiraClient?.bank.allBalances(address!);
//       }
//       const result = osmosisClient.cosmos.bank.v1beta1.allBalances({ address });
//       return result.then((res: any) => res.balances);
//     },
//     {
//       enabled: !!address && !!kujiraClient,
//       cacheTime: 0,
//     },
//   );

//   return {
//     data: {
//       ...data,
//       balances: data?.filter((balance: Coin) => SUPPORTED_DENOMS.includes(balance.denom)) || [],
//     },
//     ...other,
//   };
// };

// export default useBalances;
