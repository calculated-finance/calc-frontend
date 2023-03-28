import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { useNetwork } from './useNetwork';
import useQueryWithNotification from './useQueryWithNotification';

// export function getDisplayAmount(token: string | undefined, amount: number) {
//   return Number(getDenomInfo(token).conversion(amount));
// }

const useAdminBalances = (address: string) => {
  const [{ query }] = useNetwork();

  const result = useQueryWithNotification(['admin-balances', address], async () => query?.bank.allBalances(address), {
    enabled: !!query,
  });

  return {
    balances: result.data?.filter((balance) => SUPPORTED_DENOMS.includes(balance.denom)),
    ...result,
  };
};

export default useAdminBalances;
