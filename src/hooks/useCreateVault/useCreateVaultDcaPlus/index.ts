import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { isNil } from 'lodash';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DcaPlusState } from '@models/dcaPlusFormData';
import useFiatPrice from '@hooks/useFiatPrice';
import { DenomInfo } from '@utils/DenomInfo';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { handleError } from '../handleError';
import { useTrackCreateVault } from '../useTrackCreateVault';

export const useCreateVaultDcaPlus = (initialDenom: DenomInfo | undefined) => {
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();

  const { calcSigningClient } = useCalcSigningClient();
  const track = useTrackCreateVault();

  const { price } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: DcaPlusState | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(async ({ state, reinvestStrategyData }) => {
    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    const swapAmount = getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration);

    checkSwapAmountValue(swapAmount, price);

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: 'daily' as ExecutionIntervals, increment: 1 },
      swapAmount: getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration),
      transactionType,
      slippageTolerance: state.slippageTolerance,
      isDcaPlus: true,
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

    try {
      const createResponse = await calcSigningClient.createStrategy(
        address,
        state.initialDeposit,
        fee,
        createVaultContext,
      );
      track();
      return createResponse;
    } catch (error) {
      return handleError(createVaultContext)(error);
    }
  });
};
