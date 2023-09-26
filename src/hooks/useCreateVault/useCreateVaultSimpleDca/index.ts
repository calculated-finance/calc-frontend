import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { SimplifiedDcaInFormData, initialValues } from '@models/DcaInFormData';
import useFiatPrice from '@hooks/useFiatPrice';
import { DenomInfo } from '@utils/DenomInfo';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { featureFlags } from 'src/constants';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { handleError } from '../handleError';
import { useTrackCreateVault } from '../useTrackCreateVault';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';

export const useCreateVaultSimpleDca = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const client = useCalcSigningClient();
  const { address } = useWallet();

  const track = useTrackCreateVault();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: SimplifiedDcaInFormData | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(({ state }) => {
    if (!state) {
      throw new Error('No state');
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

    if (featureFlags.adjustedMinimumSwapAmountEnabled) {
      checkSwapAmountValue(state.swapAmount, price);
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      swapAmount: state.swapAmount,
      transactionType,
      slippageTolerance: initialValues.slippageTolerance,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: undefined,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
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
