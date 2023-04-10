import { useWallet } from '@hooks/useWallet';
import { Coin } from '@cosmjs/stargate';
import { SUPPORTED_DENOMS } from '@utils/SUPPORTED_DENOMS';
import useQueryWithNotification from './useQueryWithNotification';
import { useKujira } from './useKujira';
import { Chains, useChain } from './useChain';
import { useOsmosis } from './useOsmosis';

const useBalances = () => {
  const { address } = useWallet();
  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);
  const { chain } = useChain();

  const { data, ...other } = useQueryWithNotification(
    ['balances', address, chain],
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
    data: {
      ...data,
      balances: data?.filter((balance: Coin) => SUPPORTED_DENOMS.includes(balance.denom)) || [],
    },
    ...other,
  };
};

export default useBalances;
