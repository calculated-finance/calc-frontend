import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import useFiatPrices from '@hooks/useFiatPrices';
import { useTrackCreateVault } from '@hooks/useCreateVault/useTrackCreateVault';
import { BuildCreateVaultContext } from '../buildCreateVaultParams';
import { handleError } from '../handleError';

export const useCreateVaultDca = () => {
  const { transactionType } = useStrategyInfo();
  const { calcSigningClient } = useCalcSigningClient();
  const { address } = useWallet();
  const { fiatPrices } = useFiatPrices();

  const track = useTrackCreateVault();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    Partial<{
      state: Partial<DcaInFormDataAll> | undefined;
      reinvestStrategyData: Strategy | undefined;
    }>
  >(async ({ state, reinvestStrategyData }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!isNil(state.reinvestStrategy) && !isEmpty(state.reinvestStrategy) && !reinvestStrategyData) {
      throw new Error('Invalid reinvest strategy.');
    }

    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    if (!state.initialDenom) {
      throw Error('Invalid initial denom');
    }

    const price = state.initialDenom?.coingeckoId && fiatPrices?.[state.initialDenom?.coingeckoId]?.usd;

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    checkSwapAmountValue(state.swapAmount!, price);

    if (!state.resultingDenom) {
      throw new Error('Invalid resulting denom');
    }

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: state.initialDenom,
      resultingDenom: state.resultingDenom,
      timeInterval: { interval: state.executionInterval!, increment: state.executionIntervalIncrement! },
      timeTrigger: { startDate: state.startDate, startTime: state.purchaseTime },
      startPrice: state.startPrice || undefined,
      swapAmount: state.swapAmount!,
      route: state.route,
      priceThreshold: state.priceThresholdValue || undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance!,
      destinationConfig: {
        autoStakeValidator: state.autoStakeValidator || undefined,
        autoCompoundStakingRewards: state.autoCompoundStakingRewards,
        recipientAccount: state.recipientAccount || undefined,
        yieldOption: state.yieldOption || undefined,
        reinvestStrategyId: state.reinvestStrategy || undefined,
        senderAddress: address,
      },
    };

    const fee = createStrategyFeeInTokens(price, state.initialDenom).toFixed(0);

    try {
      const createResponse = await calcSigningClient.createStrategy(
        address,
        state.initialDeposit!,
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
