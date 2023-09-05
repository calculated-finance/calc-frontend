import { TransactionType } from '@components/TransactionType';
import { ChainConfig } from '@helpers/chains';
import {
  buildCallbackDestinations,
  getExecutionInterval,
  getReceiveAmount,
  getSlippageWithoutTrailingZeros,
} from '@hooks/useCreateVault/buildCreateVaultParams';
import { ExecutionIntervals } from '@models/ExecutionIntervals';
import { DenomInfo } from '@utils/DenomInfo';
import { ExecuteMsg } from 'kujira.js/lib/cjs/fin';
import { Config } from 'kujira.js/lib/cjs/usk';

export type DestinationConfigControlDesk = {
  recipientAccount: string | undefined;
  senderAddress: string;
};

export type BuildCreateVaultControlDeskContext = {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  timeInterval: {
    increment: number;
    interval: ExecutionIntervals;
  };
  targetAmount: number;
  startPrice?: number;
  swapAmount: number;
  priceThreshold?: number;
  transactionType: TransactionType;
  slippageTolerance: number;
  // swapAdjustment?: SwapAdjustment;
  destinationConfig: DestinationConfigControlDesk;
};

export function buildCreateVaultMsg(
  chainConfig: ChainConfig,
  fetchedConfig: Config,
  {
    initialDenom,
    resultingDenom,
    startPrice,
    swapAmount,
    priceThreshold,
    transactionType,
    slippageTolerance,
    destinationConfig,
    timeInterval,
  }: BuildCreateVaultControlDeskContext,
): ExecuteMsg {
  const msg = {
    create_vault: {
      label: '',
      time_interval: getExecutionInterval(timeInterval.interval, timeInterval.increment),
      target_denom: resultingDenom.id,
      swap_amount: swapAmount,
      minimum_receive_amount: priceThreshold
        ? getReceiveAmount(initialDenom, swapAmount, priceThreshold, resultingDenom, transactionType)
        : undefined,
      slippage_tolerance: getSlippageWithoutTrailingZeros(slippageTolerance),
      destinations: buildCallbackDestinations(
        chainConfig,
        destinationConfig.recipientAccount,
        destinationConfig.senderAddress,
        undefined,
        '',
        undefined,
      ),
      target_receive_amount: startPrice
        ? getReceiveAmount(initialDenom, swapAmount, startPrice, resultingDenom, transactionType)
        : undefined,
    },
  };

  return { launch: msg };

  // return msg       Need to figure out how to make this work.
}
