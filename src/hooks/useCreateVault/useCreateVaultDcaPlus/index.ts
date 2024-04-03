import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DcaPlusState } from '@models/dcaPlusFormData';
import useFiatPrice from '@hooks/useFiatPrice';
import { InitialDenomInfo } from '@utils/DenomInfo';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useTrackCreateVault } from '@hooks/useCreateVault/useTrackCreateVault';
import { useChainId } from '@hooks/useChainId';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { handleError } from '../handleError';

export const useCreateVaultDcaPlus = (initialDenom: InitialDenomInfo | undefined) => {
  const { chainId } = useChainId();
  const { transactionType } = useStrategyInfo();
  const { address } = useWallet();

  const { calcSigningClient } = useCalcSigningClient();
  const track = useTrackCreateVault();

  const { fiatPrice } = useFiatPrice(initialDenom);

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: DcaPlusState | undefined;
      reinvestStrategyData: Strategy | undefined;
    }
  >(async ({ state, reinvestStrategyData }) => {
    if (!initialDenom) {
      throw Error('Invalid initial denom');
    }

    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!fiatPrice) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    const swapAmount = getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration);

    checkSwapAmountValue(chainId, swapAmount, fiatPrice);

    if (!state.resultingDenom) {
      throw new Error('Invalid resulting denom');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom,
      resultingDenom: state.resultingDenom,
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

    const fee = createStrategyFeeInTokens(fiatPrice, initialDenom).toFixed(0);

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
