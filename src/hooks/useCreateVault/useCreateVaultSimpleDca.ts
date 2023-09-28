import { useWallet } from '@hooks/useWallet';
import { useMutation } from '@tanstack/react-query';
import getDenomInfo from '@utils/getDenomInfo';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { Strategy } from '@models/Strategy';
import { SimplifiedDcaInFormData, initialValues } from '@models/DcaInFormData';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { checkSwapAmountValue } from '@helpers/checkSwapAmountValue';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import { useTrackCreateVault } from './useTrackCreateVault';
import { BuildCreateVaultContext } from './buildCreateVaultParams';
import { handleError } from './handleError';
import useFiatPrices from '@hooks/useFiatPrices';

export const useCreateVaultSimpleDcaIn = () => {
  const { transactionType } = useStrategyInfo();
  const client = useCalcSigningClient();
  const { address } = useWallet();

  const track = useTrackCreateVault();

  const { prices } = useFiatPrices();

  return useMutation<
    Strategy['id'] | undefined,
    Error,
    {
      state: SimplifiedDcaInFormData | undefined;
    }
  >(({ state }) => {
    if (!state) {
      throw new Error('No state');
    }

    if (!client) {
      throw Error('Invalid client');
    }

    const initialDenom = getDenomInfo(state.initialDenom);
    const price = initialDenom?.coingeckoId && prices?.[initialDenom?.coingeckoId]?.['usd'];

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
