import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Trigger } from '../models/Trigger';
import { Strategy } from './useStrategies';

export type UseStrategyResponse = {
  vault: Strategy;
  trigger: Trigger;
};

export default function useStrategy(id?: Strategy['id']) {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<UseStrategyResponse, Error>(
    ['strategy', address, id],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vault: {
          vault_id: id,
          address,
        },
      }),
    {
      enabled: !!address && !!client && !!id,
    },
  );
}
