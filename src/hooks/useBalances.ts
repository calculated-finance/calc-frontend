import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';

const useBalances = () => {
  const { address } = useWallet();

  return useQuery(
    ['balances', address],
    async () => {
      const result = await fetch(`https://lcd.harpoon.kujira.setten.io/cosmos/bank/v1beta1/balances/${address}`);
      return result.json();
    },
    {
      enabled: !!address,
    },
  );
};

export default useBalances;
