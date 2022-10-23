import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { Strategy } from './useStrategies';

const useCancelStrategy = () => {
  const { address, client } = useWallet();

  return useMutation((strategyId: Strategy['id']) => {
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
    };

    return client.execute(address, CONTRACT_ADDRESS, msg, 'auto');
  });
};

export default useCancelStrategy;
