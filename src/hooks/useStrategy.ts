import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { QueryMsg } from 'src/interfaces/generated/query';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';
import { Strategy } from './useStrategies';

export default function useStrategy(id?: Strategy['id']) {
  const { address, client } = useWallet();

  return useQuery<VaultResponse, Error>(
    ['strategy', address, id, client],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vault: {
          vault_id: id,
          address,
        },
      } as QueryMsg),
    {
      enabled: !!address && !!client && !!id,
    },
  );
}
