/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import DcaInFormData from 'src/types/DcaInFormData';
import totalExecutions from 'src/utils/totalExecutions';

import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import getDenomInfo from '@utils/getDenomInfo';
import usePairs, { Pair } from './usePairs';

const useCreateVault = (formData: DcaInFormData) => {
  const { address: senderAddress, client } = useWallet();
  const { data } = usePairs();

  const {
    step1: { quoteDenom, baseDenom, initialDeposit },
    step2: { startDate, swapAmount, executionInterval },
  } = formData;

  return useMutation<ExecuteResult>(() => {
    if (!startDate || !initialDeposit || !swapAmount || !executionInterval || !quoteDenom || !baseDenom) {
      throw new Error('Missing required data');
    }

    // throw error if pair not found
    // TODO: note that we need to make sure pairAddress has been set by the time mutate is called
    // (usePair might not have fetched yet)

    const pairAddress = data?.pairs?.find(
      (pair: Pair) => pair.base_denom === baseDenom && pair.quote_denom === quoteDenom,
    )?.address;

    const { deconversion } = getDenomInfo(quoteDenom);

    const msg = {
      create_vault: {
        execution_interval: executionInterval,
        pair_address: pairAddress,
        position_type: 'enter',
        swap_amount: deconversion(swapAmount).toString(),
        total_executions: totalExecutions(initialDeposit, swapAmount),
        target_start_time_utc_seconds: (new Date(startDate).valueOf() / 1000).toString(),
      },
    };
    const funds = [{ denom: quoteDenom, amount: deconversion(initialDeposit).toString() }];

    if (!pairAddress || !client) {
      throw Error('Invalid form data');
    }

    return client.execute(senderAddress, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
  });
};
export default useCreateVault;
