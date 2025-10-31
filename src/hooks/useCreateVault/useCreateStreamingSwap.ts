import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { useChainId } from '@hooks/useChainId';
import useFiatPrices from '@hooks/useFiatPrices';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { useWallet } from '@hooks/useWallet';
import { Strategy } from '@models/Strategy';
import { FormData } from '@models/StreamingSwapFormData';
import { useMutation } from '@tanstack/react-query';
import { BuildCreateVaultContext } from './buildCreateVaultParams';
import { handleError } from './handleError';

export const useCreateStreamingSwap = () => {
  const { chainId } = useChainId();
  const { transactionType } = useStrategyInfo();
  const { calcSigningClient } = useCalcSigningClient();
  const { address } = useWallet();
  const { fiatPrices: prices } = useFiatPrices();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: FormData | undefined;
    }
  >(async ({ state }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!calcSigningClient) {
      throw Error('Invalid client');
    }

    const price = state.initialDenom?.coingeckoId && prices?.[state.initialDenom?.coingeckoId]?.usd;

    if (!price) {
      throw Error('Invalid price');
    }

    if (!address) {
      throw new Error('No sender address');
    }

    checkSwapAmountValue(chainId, state.swapAmount!, price);

    if (!state.resultingDenom) {
      throw new Error('Invalid resulting denom');
    }

    const createVaultContext: BuildCreateVaultContext = {
      label: 'Streaming Swap',
      initialDenom: state.initialDenom,
      resultingDenom: state.resultingDenom,
      timeInterval: { interval: state.executionInterval!, increment: state.executionIntervalIncrement },
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: state.swapAmount,
      priceThreshold: state.priceThreshold || undefined,
      transactionType,
      route: state.route,
      slippageTolerance: state.slippageTolerance,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: undefined,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
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
      return createResponse;
    } catch (error) {
      return handleError(createVaultContext)(error);
    }
  });
};
