/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useExecuteContract } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import DcaInFormData from 'src/types/DcaInFormData';
import totalExecutions from 'src/utils/totalExecutions';

const useCreateVault = () => {
  const { mutate, ...rest } = useExecuteContract({
    address: CONTRACT_ADDRESS,
  });

  const createVault = (state: DcaInFormData, options: any) => {
    const { startDate, initialDeposit, swapAmount, executionInterval, quoteDenom, baseDenom } = state;

    if (!startDate || !initialDeposit || !swapAmount || !executionInterval || !quoteDenom || !baseDenom) {
      return;
    }

    mutate(
      {
        msg: {
          create_vault: {
            execution_interval: executionInterval,
            pair_address: 'kujira1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3sl8nek6',
            position_type: 'enter',
            swap_amount: swapAmount.toString(),
            total_executions: totalExecutions(initialDeposit, swapAmount),
            target_start_time_utc: new Date(startDate).toISOString(),
          },
        },
        funds: [{ denom: quoteDenom, amount: initialDeposit.toString() }],
      },
      options,
    );
  };

  return {
    createVault,
    ...rest,
  };
};

export default useCreateVault;
