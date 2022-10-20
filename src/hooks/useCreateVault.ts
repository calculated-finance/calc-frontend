/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWallet } from '@wizard-ui/react';
import { CONTRACT_ADDRESS } from 'src/constants';

import { useMutation } from '@tanstack/react-query';
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import getDenomInfo from '@utils/getDenomInfo';
import usePairs, { Pair } from './usePairs';
import { useConfirmForm } from './useDcaInForm';
import { PositionType } from './useStrategies';
import { combineDateAndTime } from '../helpers/combineDateAndTime';

const useCreateVault = (positionType: PositionType) => {
  const { address: senderAddress, client } = useWallet();
  const { data } = usePairs();

  const { state } = useConfirmForm();

  return useMutation<ExecuteResult, Error>(() => {
    if (!state) {
      throw new Error('No state');
    }

    const {
      initialDenom,
      resultingDenom,
      initialDeposit,
      startDate,
      swapAmount,
      executionInterval,
      purchaseTime,
      slippageTolerance,
      startPrice,
      advancedSettings,
      recipientAccount,
      autoStakeValidator,
    } = state;

    // throw error if pair not found
    // TODO: note that we need to make sure pairAddress has been set by the time mutate is called
    // (usePair might not have fetched yet)

    const pairAddress =
      positionType === 'enter'
        ? data?.pairs?.find((pair: Pair) => pair.base_denom === resultingDenom && pair.quote_denom === initialDenom)
            ?.address
        : data?.pairs?.find((pair: Pair) => pair.base_denom === initialDenom && pair.quote_denom === resultingDenom)
            ?.address;

    const { deconversion } = getDenomInfo(initialDenom);

    let startTimeSeconds;

    if (startDate) {
      const startTime = combineDateAndTime(startDate, purchaseTime);
      startTimeSeconds = (startTime.valueOf() / 1000).toString();
    }

    const destinations = [];

    if (autoStakeValidator) {
      destinations.push({ address: autoStakeValidator, allocation: '1' });
    }

    if (recipientAccount) {
      destinations.push({ address: recipientAccount, allocation: '1' });
    }

    const msg = {
      create_vault: {
        time_interval: executionInterval,
        pair_address: pairAddress,
        position_type: positionType,
        swap_amount: deconversion(swapAmount).toString(),
        target_start_time_utc_seconds: startTimeSeconds,
        target_price: startPrice?.toString() || undefined,
        slippage_tolerance: advancedSettings ? slippageTolerance?.toString() : undefined,
        destinations: destinations.length ? destinations : undefined,
      },
    };

    const funds = [{ denom: initialDenom, amount: deconversion(initialDeposit).toString() }];

    if (!pairAddress || !client) {
      throw Error('Invalid form data');
    }
    const result = client.execute(senderAddress, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
    return result;
  });
};
export default useCreateVault;
