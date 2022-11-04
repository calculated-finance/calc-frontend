import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { ExecuteMsg } from 'src/interfaces/generated/execute';
import { Strategy } from './useStrategies';

const useCancelStrategy = () => {
  const { address, signingClient: client } = useWallet();

  return useMutation<ExecuteResult, Error, Strategy['id']>((strategyId: Strategy['id']) => {
    if (client == null) {
      throw new Error('no client');
    }

    if (address == null) {
      throw new Error('no address');
    }

    const msg = {
      cancel_vault: {
        address,
        vault_id: strategyId,
      },
    } as ExecuteMsg;

    return client.execute(address, CONTRACT_ADDRESS, msg, 'auto');
  });
};

export default useCancelStrategy;
