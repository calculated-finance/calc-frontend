import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

export type Strategy = {
  id: string;
  owner: string;
  balance: {
    starting_balance: {
      denom: string;
      amount: string;
    };
    current_balance: {
      denom: string;
      amount: string;
    };
  };
  tracking_information: {
    last_execution_block_height: string;
    executions_remaining: number;
    target_execution_time: string;
  };
  execution_interval: string;
  configuration: {
    pair: {
      address: string;
      base_denom: string;
      quote_denom: string;
    };

    swap_amount: string;
    position_type: string;
  };
};

type Response = {
  vaults: Strategy[];
};

export default function useStrategies() {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response>(
    ['active-vaults', address],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_all_active_vaults_by_address: {
          address,
        },
      }),
    {
      enabled: !!address && !!client,
    },
  );
}

export function useCompletedStrategies() {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response>(
    ['completed-vaults', address],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_all_inactive_vaults_by_address: {
          address,
        },
      }),
    {
      enabled: !!address && !!client,
    },
  );
}
