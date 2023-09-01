import { useWallet } from '@hooks/useWallet';
import getDenomInfo from '@utils/getDenomInfo';
import { Strategy } from '@models/Strategy';
import useFiatPrice from '@hooks/useFiatPrice';
import { DenomInfo } from '@utils/DenomInfo';
import { useMutation } from '@tanstack/react-query';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useControlDeskStrategyInfo } from '../useControlDeskStrategyInfo';
import { useTrackCreateVaultOnceOff } from './once-off-payment/useTrackCreateVauleOnceOff';
import { CtrlFormDataAll } from '../Components/ControlDeskForms';
import { BuildCreateVaultControlDeskContext } from '../buildCreateVaultParamsControlDesk';

export const useCreateVaultOnceOff = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useControlDeskStrategyInfo();
  const client = useCalcSigningClient();
  const { address } = useWallet();

  const track = useTrackCreateVaultOnceOff();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: CtrlFormDataAll | undefined;
    }
  >(({ state }) => {

    if (!state) {
      throw new Error('No state');
    }

    // if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
    //   throw new Error('Invalid reinvest strategy.');
    // }

    if (!client) {
      throw Error('Invalid client');
    }

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    // if (featureFlags.adjustedMinimumSwapAmountEnabled) {
    //   checkSwapAmountValue(state.swapAmount, price);
    // }

    const createVaultContext: BuildCreateVaultControlDeskContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      // timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      startPrice: state.startPrice || undefined,
      targetAmount: state.targetAmount,
      // priceThreshold: state.priceThresholdValue || undefined,
      // transactionType,
      slippageTolerance: state.slippageTolerance,
      destinationConfig: {
        recipientAccount: state.recipientAccount || undefined,
        senderAddress: address,
      },
    };

    const fee = createStrategyFeeInTokens(price);

    // return client
    //   .createStrategy(address, state.initialDeposit, fee, createVaultContext)
    //   .then((result) => {
    //     track();
    //     return result;
    //   })
    //   .catch(handleError(createVaultContext));
    return client
      .createStrategy(address, 3, fee, createVaultContext)
      .then((result) => {
        track();
        return result;
      })
  });
};
