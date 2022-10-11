import { useQuery } from '@tanstack/react-query';
import { useCWClient, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Strategy } from './useStrategies';

type Response = {
  vault: Strategy;
};

export default function useStrategies(id: Strategy['id']) {
  const { address } = useWallet();
  const client = useCWClient();

  return useQuery<Response, Error>(
    ['strategy', address, id],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vault_by_address_and_id: {
          address,
          vault_id: id,
        },
      }),
    {
      enabled: !!address && !!client && !!id,
    },
  );
}
