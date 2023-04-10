import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import { Coin } from '@cosmjs/proto-signing';
import { useKujira } from './useKujira';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain, Chains } from './useChain';
import { useOsmosis } from './useOsmosis';

const useAdminBalances = (address: string) => {
  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);
  const { chain } = useChain();

  const result = useQueryWithNotification(
    ['admin-balances', address, chain],
    async () => {
      if (chain === Chains.Kujira) {
        return kujiraQuery?.bank.allBalances(address!);
      }
      return osmosisQuery?.cosmos.bank.v1beta1
        .allBalances({ address })
        .then((res: { balances: Coin[] }) => res.balances);
    },
    {
      enabled: !!address && !!kujiraQuery && !!osmosisQuery && !!chain,
      cacheTime: 0,
    },
  );

  return {
    balances: result.data?.filter((balance: Coin) => SUPPORTED_DENOMS.includes(balance.denom)),
    ...result,
  };
};

export default useAdminBalances;
