import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Denom } from '@hooks/usePairs';
import handleContractQueryError from './handleContractQueryError';

type StrategyBalance = {
  amount: string;
  denom: Denom;
};

type PositionType = 'enter' | 'exit';
type TriggerVariant = 'time' | 'price'; // confirm these values

export type Strategy = {
  id: string;
  owner: string;
  balances: StrategyBalance[];
  trigger_id: string;
  trigger_variant: TriggerVariant;
  status: 'active' | 'inactive';
  configuration: {
    execution_interval: string;
    pair: {
      address: string;
      base_denom: Denom;
      quote_denom: Denom;
    };
    swap_amount: string;
    position_type: PositionType;
    slippage_tolerance: number | null; // double check this type
  };
};

type Response = {
  vaults: Strategy[];
};

export default function useStrategies() {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response, Error>(
    ['active-vaults', address],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_all_vaults_by_address: {
          address,
        },
      }),
    {
      enabled: !!address && !!client,
    },
  );
}
