import * as Yup from 'yup';

import { allSchema } from './DcaInFormData';

export const dcaPlusSchema = Yup.object({
  resultingDenom: allSchema.resultingDenom,
  initialDenom: allSchema.initialDenom,
  initialDeposit: allSchema.initialDeposit,
  advancedSettings: allSchema.advancedSettings,
  startImmediately: allSchema.startImmediately,
  triggerType: allSchema.triggerType,
  startDate: allSchema.startDate,
  startPrice: allSchema.startPrice,
  purchaseTime: allSchema.purchaseTime,
  sendToWallet: allSchema.sendToWallet,
  recipientAccount: allSchema.recipientAccount,
  autoStake: allSchema.autoStake,
  autoStakeValidator: allSchema.autoStakeValidator,
  strategyDuration: allSchema.strategyDuration,
});

export enum DcaPlusSteps {
  ASSETS,
  CUSTOMISE,
  POST_PURCHASE,
  CONFIRM,
}

export const dcaPlusSteps: Record<DcaPlusSteps, Yup.AnySchema> = {
  [DcaPlusSteps.ASSETS]: dcaPlusSchema.pick(['resultingDenom', 'initialDenom', 'initialDeposit']),
  [DcaPlusSteps.CUSTOMISE]: dcaPlusSchema.pick([
    'advancedSettings',
    'startImmediately',
    'triggerType',
    'startDate',
    'startPrice',
    'purchaseTime',
    'strategyDuration',
  ]),
  [DcaPlusSteps.POST_PURCHASE]: dcaPlusSchema.pick([
    'sendToWallet',
    'recipientAccount',
    'autoStake',
    'autoStakeValidator',
  ]),
  [DcaPlusSteps.CONFIRM]: dcaPlusSchema,
};
