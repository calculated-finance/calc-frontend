/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useExecuteContract } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import DcaInFormData from 'src/types/DcaInFormData';
import totalExecutions from 'src/utils/totalExecutions';
import usePairs from './usePairs';

const useCreateVault = () => {
  const { mutate, ...rest } = useExecuteContract({
    address: CONTRACT_ADDRESS,
  });

  const { data } = usePairs();

  const createVault = (state: DcaInFormData, options: any) => {
    const { startDate, initialDeposit, swapAmount, executionInterval, quoteDenom, baseDenom } = state;

    if (!startDate || !initialDeposit || !swapAmount || !executionInterval || !quoteDenom || !baseDenom) {
      return;
    }

    const pairAddress = data?.pairs.find(
      (pair: any) => pair.base_denom === baseDenom && pair.quote_denom === quoteDenom,
    ).address;

    // throw error if pair not found
    if (!pairAddress) {
      return;
    }

    // TODO: note that we need to make sure pairAddress has been set by the time mutate is called (usePair might not have fetched yet)
    const payload = {
      msg: {
        create_vault: {
          execution_interval: executionInterval,
          pair_address: pairAddress,
          position_type: 'enter',
          swap_amount: swapAmount.toString(),
          total_executions: totalExecutions(initialDeposit, swapAmount),
          target_start_time_utc_seconds: new Date(startDate).valueOf().toString(),
        },
      },
      funds: [{ denom: quoteDenom, amount: initialDeposit.toString() }],
    };

    mutate(payload, options);
  };

  return {
    createVault,
    ...rest,
  };
};

export default useCreateVault;
