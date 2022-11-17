import { CONTRACT_ADDRESS } from 'src/constants';
import { useNetwork } from './useNetwork';
import useQueryWithNotification from './useQueryWithNotification';

// export function getDisplayAmount(token: string | undefined, amount: number) {
//   return Number(getDenomInfo(token).conversion(amount));
// }

const useAdminBalances = (address: string) => {
  const { query } = useNetwork();

  return useQueryWithNotification(['admin-balances', address], async () => query?.bank.allBalances(address), {
    enabled: !!query,
  });

  // return {
  //   displayAmount: result.data ? getDisplayAmount(token, Number(result.data.amount)) : 0,
  //   ...result,
  // };
};

export default useAdminBalances;
