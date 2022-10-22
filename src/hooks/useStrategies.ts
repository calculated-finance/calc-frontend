import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Denom } from '@hooks/usePairs';
import { queryClient } from 'src/pages/_app.page';
import DenomAmount from '../models/DenomAmount';

export type PositionType = 'enter' | 'exit';
type TriggerVariant = 'time' | 'price'; // confirm these values
const QUERY_KEY = 'active-vaults';

type StrategyDestination = {
  address: string;
  allocation: string;
};

export const invalidateStrategies = () => queryClient.invalidateQueries([QUERY_KEY]);

export type Strategy = {
  id: string;
  created_at: string;
  owner: string;
  destinations: StrategyDestination[];
  balance: DenomAmount;
  trigger_id: string;
  trigger_variant: TriggerVariant;
  status: 'active' | 'inactive';
  time_interval: string;
  started_at: string;
  pair: {
    address: string;
    base_denom: Denom;
    quote_denom: Denom;
  };
  swap_amount: string;
  position_type: PositionType;
  slippage_tolerance: number | null; // double check this type
};

type Response = {
  vaults: Strategy[];
};

export default function useStrategies() {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response, Error>(
    [QUERY_KEY, address],
    () => {
      const result = client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vaults_by_address: {
          address,
        },
      });
      return result;
    },
    {
      enabled: !!address && !!client,
    },
  );
}
