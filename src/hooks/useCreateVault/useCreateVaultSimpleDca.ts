import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { SimplifiedDcaInFormData } from '@models/DcaInFormData';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { SIMPLIFIED_DCA_SLIPPAGE_TOLERANCE } from 'src/constants';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import useFiatPrices from '@hooks/useFiatPrices';
import { useTrackCreateVault } from './useTrackCreateVault';
import { BuildCreateVaultContext } from './buildCreateVaultParams';
import { handleError } from './handleError';

export const useCreateVaultSimpleDcaIn = () => {
  const { transactionType } = useStrategyInfo();
  const { calcSigningClient } = useCalcSigningClient();
  const { address } = useWallet();

  const track = useTrackCreateVault();

  const { prices } = useFiatPrices();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: SimplifiedDcaInFormData | undefined;
    }
  >(async ({ state }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    const initialDenom = getDenomInfo(state.initialDenom);
    const price = initialDenom?.coingeckoId && prices?.[initialDenom?.coingeckoId]?.usd;

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    checkSwapAmountValue(state.swapAmount, price);

    const createVaultContext: BuildCreateVaultContext = {
      initialDenom: getDenomInfo(state.initialDenom),
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval, increment: state.executionIntervalIncrement },
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: state.swapAmount,
      priceThreshold: undefined,
      transactionType,
      slippageTolerance: SIMPLIFIED_DCA_SLIPPAGE_TOLERANCE,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: undefined,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
        senderAddress: address,
      },
    };

    try {
      const createResponse = await calcSigningClient.createStrategy(
        address,
        state.initialDeposit,
        createStrategyFeeInTokens(price),
        createVaultContext,
      );
      track();
      return createResponse;
    } catch (error) {
      return handleError(createVaultContext)(error);
    }
  });
};
