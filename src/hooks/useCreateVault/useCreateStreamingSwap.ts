import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import useFiatPrices from '@hooks/useFiatPrices';
import { FormData } from '@models/StreamingSwapFormData';
import { BuildCreateVaultContext } from './buildCreateVaultParams';
import { handleError } from './handleError';
import { useTrackCreateVault } from './useTrackCreateVault';

export const useCreateStreamingSwap = () => {
  const { transactionType } = useStrategyInfo();
  const { calcSigningClient } = useCalcSigningClient();
  const { address } = useWallet();
  const { fiatPrices: prices } = useFiatPrices();

  const track = useTrackCreateVault();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: FormData | undefined;
    }
  >(async ({ state }) => {
    console.log(state);
    if (!state) {
      throw new Error('No state');
    }

    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    const initialDenomInfo = getDenomInfo(state.initialDenom);
    const price = initialDenomInfo?.coingeckoId && prices?.[initialDenomInfo?.coingeckoId]?.usd;

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    checkSwapAmountValue(state.swapAmount!, price);

    const createVaultContext: BuildCreateVaultContext = {
      label: 'Streaming Swap',
      initialDenom: initialDenomInfo,
      resultingDenom: getDenomInfo(state.resultingDenom),
      timeInterval: { interval: state.executionInterval!, increment: state.executionIntervalIncrement },
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: state.swapAmount,
      priceThreshold: state.priceThreshold || undefined,
      transactionType,
      slippageTolerance: state.slippageTolerance,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: undefined,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
        senderAddress: address,
      },
      isInAtomics: true,
    };

    const fee = createStrategyFeeInTokens(price, initialDenomInfo).toFixed(0);

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
