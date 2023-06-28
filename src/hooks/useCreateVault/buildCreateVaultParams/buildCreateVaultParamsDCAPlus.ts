import { TransactionType } from '@components/TransactionType';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { ExecuteMsg, PositionType } from 'src/interfaces/v2/generated/execute';
import { ExecuteMsg as OsmosisExecuteMsg } from 'src/interfaces/generated-osmosis/execute';
import getDenomInfo from '@utils/getDenomInfo';
import { getSwapAmountFromDuration } from '@helpers/getSwapAmountFromDuration';
import { Chains } from '@hooks/useChain/Chains';
import { Config } from 'src/interfaces/v2/generated/response/get_config';
import { buildCallbackDestinations } from '@helpers/destinations';
import { buildCreateVaultMsg } from '.';

export function buildCreateVaultParamsDCAPlus(
  state: DcaPlusState,
  transactionType: TransactionType,
  senderAddress: string,
  chain: Chains,
  config: Config,
) {
  const initialDenom = getDenomInfo(state.initialDenom);
  const resultingDenom = getDenomInfo(state.resultingDenom);

  const destinations = buildCallbackDestinations(
    chain,
    state.autoStakeValidator,
    state.recipientAccount,
    state.yieldOption,
    senderAddress,
    state.reinvestStrategy,
  );

  const msg = buildCreateVaultMsg({
    initialDenom,
    resultingDenom,
    timeInterval: { interval: 'daily', increment: 1 },
    timeTrigger: undefined,
    startPrice: undefined,
    swapAmount: getSwapAmountFromDuration(state.initialDeposit, state.strategyDuration),
    priceThreshold: undefined,
    transactionType,
    slippageTolerance: state.slippageTolerance,
    destinations,
    isDcaPlus: true,
    config,
  });

  return msg;
}
