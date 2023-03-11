import getDenomInfo from '@utils/getDenomInfo';
import { isNil } from 'lodash';
import { MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import * as Yup from 'yup';

import { allSchema } from './DcaInFormData';
import { StartImmediatelyValues } from './StartImmediatelyValues';

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

      const dcaPlusMinimumDeposit = minimumSwapAmount * MIN_DCA_PLUS_STRATEGY_DURATION;

      if (value > dcaPlusMinimumDeposit) {
        return true;
      }
      return context.createError({ message: `Swap amount should be greater than ${dcaPlusMinimumDeposit}` });
    },
  }),
  advancedSettings: allSchema.advancedSettings,
  startImmediately: allSchema.startImmediately.when('advancedSettings', {
    is: false,
    then: (schema) => schema.transform(() => StartImmediatelyValues.Yes),
  }),
  triggerType: allSchema.triggerType,
  slippageTolerance: allSchema.slippageTolerance,
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
  'slippageTolerance',
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
