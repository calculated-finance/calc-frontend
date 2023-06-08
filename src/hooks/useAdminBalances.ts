import { Coin } from '@cosmjs/proto-signing';
import { getChainContractAddress, getChainFeeTakerAddress } from '@helpers/chains';
import { useKujira } from './useKujira';
import useQueryWithNotification from './useQueryWithNotification';
import { useChain } from './useChain';
import { Chains } from './useChain/Chains';
import { useOsmosis } from './useOsmosis';
import { useSupportedDenoms } from './useSupportedDenoms';

const useContractBalances = () => {
  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);
  const { chain } = useChain();

  const supportedDenoms = useSupportedDenoms();

  const result = useQueryWithNotification(
    ['admin-contract-balances', chain],
    async () => {
      if (chain === Chains.Kujira) {
        return kujiraQuery?.bank.allBalances(getChainContractAddress(Chains.Kujira));
      }
      return osmosisQuery?.cosmos.bank.v1beta1
        .allBalances({ address: getChainContractAddress(Chains.Osmosis) })
        .then((res: { balances: Coin[] }) => res.balances);
    },
    {
      enabled: !!kujiraQuery && !!osmosisQuery && !!chain,
      cacheTime: 0,
    },
  );

  return {
    balances: result.data?.filter((balance: Coin) => supportedDenoms.map((sd) => sd.id).includes(balance.denom)),
    ...result,
  };
};

export const useFeeTakerBalances = () => {
  const kujiraQuery = useKujira((state) => state.query);
  const osmosisQuery = useOsmosis((state) => state.query);
  const { chain } = useChain();

  const supportedDenoms = useSupportedDenoms();

  const result = useQueryWithNotification(
    ['admin-fee-taker-balances', chain],
    async () => {
      if (chain === Chains.Kujira) {
        return kujiraQuery?.bank.allBalances(getChainFeeTakerAddress(Chains.Kujira));
      }
      return osmosisQuery?.cosmos.bank.v1beta1
        .allBalances({ address: getChainFeeTakerAddress(Chains.Osmosis) })
        .then((res: { balances: Coin[] }) => res.balances);
    },
    {
      enabled: !!kujiraQuery && !!osmosisQuery && !!chain,
      cacheTime: 0,
    },
  );

  return {
    balances: result.data?.filter((balance: Coin) => supportedDenoms.map((sd) => sd.id).includes(balance.denom)),
    ...result,
  };
};

export default useContractBalances;
