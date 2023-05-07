import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import { isNil } from 'lodash';
import { DCA_PLUS_MIN_SWAP_COEFFICIENT, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import * as Yup from 'yup';

import { allSchema } from './DcaInFormData';
import YesNoValues from './YesNoValues';

export const weightedScaleSchema = Yup.object({
  resultingDenom: allSchema.resultingDenom,
  initialDenom: allSchema.initialDenom,
  initialDeposit: allSchema.initialDeposit.test({
    name: 'greater-than-minimum-deposit',
    test(value, context) {
      if (isNil(value)) {
        return true;
      }
      const { initialDenom = null } = { ...context.parent, ...context.options.context };
      if (!initialDenom) {
        return true;
      }
      const { minimumSwapAmount = 0 } = getDenomInfo(initialDenom);

      const dcaPlusMinimumDeposit = minimumSwapAmount * DCA_PLUS_MIN_SWAP_COEFFICIENT * MIN_DCA_PLUS_STRATEGY_DURATION;

      if (value > dcaPlusMinimumDeposit) {
        return true;
      }
      return context.createError({
        message: `Initial deposit must be more than ${dcaPlusMinimumDeposit} ${getDenomName(
          initialDenom,
        )}, otherwise the minimum swap amount will decay performance. We recommend depositing at least $50 worth of assets.`,
      });
    },
  }),
  advancedSettings: allSchema.advancedSettings,
  slippageTolerance: allSchema.slippageTolerance,
  sendToWallet: allSchema.sendToWallet,
  recipientAccount: allSchema.recipientAccount,
  autoStakeValidator: allSchema.autoStakeValidator,
  strategyDuration: allSchema.strategyDuration,
  postPurchaseOption: allSchema.postPurchaseOption,
  yieldOption: allSchema.yieldOption,
  reinvestStrategy: allSchema.reinvestStrategy,
  executionInterval: allSchema.executionInterval,
  swapAmount: allSchema.swapAmount,
  basePriceIsCurrentPrice: Yup.mixed<YesNoValues>().oneOf(Object.values(YesNoValues)).required(),
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
});

export const WeightedScaleAssetsFormSchema = weightedScaleSchema.pick([
  'resultingDenom',
  'initialDenom',
  'initialDeposit',
]);
export const WeightedScaleCustomiseFormSchema = weightedScaleSchema.pick([
  'advancedSettings',
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
