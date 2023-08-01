import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { isNil } from 'lodash';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import useFiatPrice from '@hooks/useFiatPrice';
import { DenomInfo } from '@utils/DenomInfo';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { featureFlags } from 'src/constants';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { handleError } from '../handleError';
import { useTrackCreateVault } from '../useTrackCreateVault';

export const useCreateVaultDca = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const client = useCalcSigningClient();
  const { address } = useWallet();

  const track = useTrackCreateVault();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: DcaInFormDataAll | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(({ state, reinvestStrategyData }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    const swapAmountValue = state.swapAmount * price;

    if (featureFlags.adjustedMinimumSwapAmountEnabled) {
      checkSwapAmountValue(swapAmountValue);
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      timeTrigger: { startDate: state.startDate, startTime: state.purchaseTime },
      startPrice: state.startPrice || undefined,
      swapAmount: state.swapAmount,
      priceThreshold: state.priceThresholdValue || undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance,
      destinationConfig: {
        autoStakeValidator: state.autoStakeValidator || undefined,
        autoCompoundStakingRewards: state.autoCompoundStakingRewards,
        recipientAccount: state.recipientAccount || undefined,
        yieldOption: state.yieldOption || undefined,
        reinvestStrategyId: state.reinvestStrategy || undefined,
        senderAddress: address,
      },
    };

    const fee = createStrategyFeeInTokens(price);

    return client
      .createStrategy(address, state.initialDeposit, fee, createVaultContext)
      .then((result) => {
        track();
        return result;
      })
      .catch(handleError(createVaultContext));
  });
};
