import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { QueryMsg } from 'src/interfaces/generated/query';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';
import useQueryWithNotification from './useQueryWithNotification';
import { Strategy } from './useStrategies';

export default function useStrategy(id?: Strategy['id']) {
  const { client } = useWallet();

  return useQueryWithNotification<VaultResponse>(
    ['strategy', id, client],
    () =>
      client!.queryContractSmart(CONTRACT_ADDRESS, {
        get_vault: {
          vault_id: id,
        },
      } as QueryMsg),
    {
      enabled: !!client && !!id,
    },
  );
}
