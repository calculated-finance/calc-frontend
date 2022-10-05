/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';
import { allValidationSchema } from 'src/types/DcaInFormData';
import totalExecutions from 'src/utils/totalExecutions';

import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import getDenomInfo from '@utils/getDenomInfo';
import * as Yup from 'yup';
import usePairs, { Pair } from './usePairs';
import { useConfirmForm } from './useDcaInForm';

const useCreateVault = () => {
  const { address: senderAddress, client } = useWallet();
  const { data } = usePairs();

  const { state } = useConfirmForm();

  return useMutation<ExecuteResult>(() => {
    if (!state) {
      throw new Error('No state');
    }

    const {
      quoteDenom,
      baseDenom,
      initialDeposit,
      startDate,
      swapAmount,
      executionInterval,
      purchaseTime,
      slippageTolerance,
    } = state;

    // throw error if pair not found
    // TODO: note that we need to make sure pairAddress has been set by the time mutate is called
    // (usePair might not have fetched yet)

    const pairAddress = data?.pairs?.find(
      (pair: Pair) => pair.base_denom === baseDenom && pair.quote_denom === quoteDenom,
    )?.address;

    const { deconversion } = getDenomInfo(quoteDenom);

    let startTimeSeconds;

    if (startDate) {
      const startTime = new Date(startDate);
      if (purchaseTime) {
        const [hours, minutes] = purchaseTime.split(':');
        startTime.setHours(parseInt(hours, 10));
        startTime.setMinutes(parseInt(minutes, 10));
      }
      startTimeSeconds = (startTime.valueOf() / 1000).toString();
    }

    const msg = {
      create_vault_with_time_trigger: {
        time_interval: executionInterval,
        pair_address: pairAddress,
        position_type: 'enter',
        swap_amount: deconversion(swapAmount).toString(),
        total_executions: totalExecutions(initialDeposit, swapAmount),
        target_start_time_utc_seconds: startTimeSeconds,
        slippageTolerance,
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
