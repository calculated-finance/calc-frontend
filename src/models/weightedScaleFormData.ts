import * as Yup from 'yup';

import { allSchema } from './DcaInFormData';
import YesNoValues from './YesNoValues';

export const weightedScaleSchema = Yup.object({
  resultingDenom: allSchema.resultingDenom,
  initialDenom: allSchema.initialDenom,
  initialDeposit: allSchema.initialDeposit,
  advancedSettings: allSchema.advancedSettings,
  slippageTolerance: allSchema.slippageTolerance,
  sendToWallet: allSchema.sendToWallet,
  recipientAccount: allSchema.recipientAccount,
  autoStakeValidator: allSchema.autoStakeValidator,
  postPurchaseOption: allSchema.postPurchaseOption,
  yieldOption: allSchema.yieldOption,
  reinvestStrategy: allSchema.reinvestStrategy,
  executionInterval: allSchema.executionInterval,
  swapAmount: allSchema.swapAmount,
  basePriceIsCurrentPrice: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .required()
    .when('advancedSettings', {
      is: false,
      then: (schema) => schema.transform(() => YesNoValues.Yes),
    }),
  basePriceValue: Yup.number()
    .nullable()
    .label('Base Price')
    .positive()
    .when('basePriceIsCurrentPrice', {
      is: YesNoValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  swapMultiplier: Yup.number().required(),
  applyMultiplier: Yup.mixed<YesNoValues>().oneOf(Object.values(YesNoValues)).required(),
  startImmediately: allSchema.startImmediately.when('advancedSettings', {
    is: false,
    then: (schema) => schema.transform(() => YesNoValues.Yes),
  }),
  triggerType: allSchema.triggerType,
  startDate: allSchema.startDate,
  startPrice: allSchema.startPrice,
  purchaseTime: allSchema.purchaseTime,
});

export const WeightedScaleAssetsFormSchema = weightedScaleSchema.pick([
  'resultingDenom',
  'initialDenom',
  'initialDeposit',
]);
export const WeightedScaleCustomiseFormSchema = weightedScaleSchema.pick([
  'advancedSettings',
  'startImmediately',
  'triggerType',
  'startDate',
  'startPrice',
  'purchaseTime',
  'executionInterval',
  'swapAmount',
  'basePriceIsCurrentPrice',
  'basePriceValue',
  'swapMultiplier',
  'applyMultiplier',
  'slippageTolerance',
]);
export const WeightedScalePostPurchaseFormSchema = weightedScaleSchema.pick([
  'sendToWallet',
  'recipientAccount',
  'autoStakeValidator',
  'postPurchaseOption',
  'yieldOption',
  'reinvestStrategy',
]);
export const WeightedScaleConfirmFormSchema = weightedScaleSchema;

// infer type
export type WeightedScaleState = Yup.InferType<typeof weightedScaleSchema>;
