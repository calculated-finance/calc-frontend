import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import { isNil } from 'lodash';
import { DCA_PLUS_MIN_SWAP_COEFFICIENT, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import * as Yup from 'yup';

import { allSchema } from './DcaInFormData';

export const dcaPlusSchema = Yup.object({
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

      console.log(initialDenom);

      return context.createError({
        message: `Initial deposit must be more than ${dcaPlusMinimumDeposit} ${getDenomName(
          getDenomInfo(initialDenom),
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
});

export const DcaPlusAssetsFormSchema = dcaPlusSchema.pick(['resultingDenom', 'initialDenom', 'initialDeposit']);
export const DcaPlusCustomiseFormSchema = dcaPlusSchema.pick([
  'advancedSettings',
  'strategyDuration',
  'slippageTolerance',
]);
export const DcaPlusPostPurchaseFormSchema = dcaPlusSchema.pick([
  'sendToWallet',
  'recipientAccount',
  'autoStakeValidator',
  'postPurchaseOption',
  'yieldOption',
  'reinvestStrategy',
]);
export const DcaPlusConfirmFormSchema = dcaPlusSchema;

// infer type
export type DcaPlusState = Yup.InferType<typeof dcaPlusSchema>;
