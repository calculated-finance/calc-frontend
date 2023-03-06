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

export const DcaPlusAssetsFormSchema = dcaPlusSchema.pick(['resultingDenom', 'initialDenom', 'initialDeposit']);
export const DcaPlusCustomiseFormSchema = dcaPlusSchema.pick([
  'advancedSettings',
  'startImmediately',
  'triggerType',
  'startDate',
  'startPrice',
  'purchaseTime',
  'strategyDuration',
]);
export const DcaPlusPostPurchaseFormSchema = dcaPlusSchema.pick([
  'sendToWallet',
  'recipientAccount',
  'autoStake',
  'autoStakeValidator',
]);
export const DcaPlusConfirmFormSchema = dcaPlusSchema;

// infer type
export type DcaPlusState = Yup.InferType<typeof dcaPlusSchema>;
