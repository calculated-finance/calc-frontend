import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Strategy } from './useStrategies';

type Response = {
  vault: Strategy;
};

export default function useStrategyEvents(id: Strategy['id'] | undefined) {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response, Error>(
    ['strategyEvents', address, id],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_events_by_resource_id: {
          resource_id: id,
        },
      }),
    {
      enabled: !!address && !!client && !!id,
    },
  );
}
