import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { MutateOptions } from '@tanstack/react-query';
import { useExecuteContract, useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

const useCancelStrategy = () => {
  const { address } = useWallet();

  const { mutate, ...others } = useExecuteContract({
    address: CONTRACT_ADDRESS,
  });

  const cancelStrategy = (strategyId: string, options: MutateOptions<ExecuteResult>) =>
    mutate(
      {
        msg: {
          cancel_vault_by_address_and_id: {
            address,
            vault_id: strategyId,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options,
    );

  return {
    cancelStrategy,
    ...others,
  };
};

export default useCancelStrategy;
