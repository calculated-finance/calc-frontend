import { useWallet } from '@hooks/useWallet';
import { Coin } from '@cosmjs/stargate';
import { getChainFromAddress } from '@helpers/chains';
import useQueryWithNotification from './useQueryWithNotification';
import { useKujira } from './useKujira';
import { Chains, useChain } from './useChain';
import { useOsmosis } from './useOsmosis';
import { useSupportedDenoms } from './useSupportedDenoms';

const useBalances = () => {
  const { address } = useWallet();
  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);
  const { chain } = useChain();

  const supportedDenoms = useSupportedDenoms();

  const { data, ...other } = useQueryWithNotification(
    ['balances', address, chain],
    async () => {
      if (chain === Chains.Kujira && getChainFromAddress(address!) === Chains.Kujira) {
        return kujiraQuery?.bank.allBalances(address!);
      }
      if (chain === Chains.Osmosis && getChainFromAddress(address!) === Chains.Osmosis) {
        return osmosisQuery?.cosmos.bank.v1beta1
          .allBalances({ address })
          .then((res: { balances: Coin[] }) => res.balances);
      }
      return [];
    },
    {
      enabled: !!address && !!kujiraQuery && !!osmosisQuery && !!chain,
      cacheTime: 0,
    },
  );

  return {
    data: {
      ...data,
      balances: data?.filter((balance: Coin) => supportedDenoms.includes(balance.denom)) || undefined,
    },
    ...other,
  };
};

export default useBalances;
