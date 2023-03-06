import getDenomInfo from '@utils/getDenomInfo';
import AutoStakeValues from 'src/models/AutoStakeValues';
import SendToWalletValues from 'src/models/SendToWalletValues';
import { ExecutionIntervals } from 'src/models/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/models/StartImmediatelyValues';
import TriggerTypes from 'src/models/TriggerTypes';
import * as Yup from 'yup';
import { combineDateAndTime } from 'src/helpers/combineDateAndTime';
import { ConditionBuilder } from 'yup/lib/Condition';
import { MixedSchema } from 'yup/lib/mixed';
import { Coin } from '@cosmjs/stargate';
import { isNil } from 'lodash';
import { MAX_DCA_PLUS_STRATEGY_DURATION, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import YesNoValues from './YesNoValues';
import { StrategyTypes } from './StrategyTypes';

export const initialValues = {
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: null,
  advancedSettings: false,
  startImmediately: StartImmediatelyValues.Yes,
  triggerType: TriggerTypes.Date,
  startDate: null,
  purchaseTime: '',
  startPrice: null,

  executionInterval: 'daily',
  swapAmount: null,
  slippageTolerance: 2,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: null,
  sendToWallet: SendToWalletValues.Yes,
  autoStake: AutoStakeValues.No,
  recipientAccount: '',
  autoStakeValidator: '',
  strategyDuration: 60,
};

const timeFormat = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
export const allSchema = {
  resultingDenom: Yup.string().label('Resulting Denom').required(),
  initialDenom: Yup.string().label('Initial Denom').required(),
  initialDeposit: Yup.number()
    .label('Initial Deposit')
    .positive()
    .required()
    .nullable()
    .test({
      name: 'less-than-deposit',
      message: ({ label }) => `${label} must be less than or equal to than your current balance`,
      test(value, context) {
        const { balances } = context?.options?.context || {};
        if (!balances || !value || value <= 0) {
          return true;
        }
        const amount = balances.find((balance: Coin) => balance.denom === context.parent.initialDenom)?.amount;
        if (!amount) {
          return false;
        }
        return value <= getDenomInfo(context.parent.initialDenom).conversion(Number(amount));
      },
    }),
  advancedSettings: Yup.boolean(),
  startImmediately: Yup.mixed<StartImmediatelyValues>().oneOf(Object.values(StartImmediatelyValues)).required(),
  triggerType: Yup.mixed<TriggerTypes>()
    .oneOf(Object.values(TriggerTypes))
    .required()
    .when('startImmediately', {
      is: StartImmediatelyValues.Yes,
      then: (schema) => schema.transform(() => TriggerTypes.Date),
    }),
  startDate: Yup.mixed()
    .label('Start Date')
    .nullable()
    .when(['startImmediately', 'triggerType', 'advancedSettings'], ((
      startImmediately,
      triggerType,
      advancedSettings,
      schema,
    ) => {
      if (triggerType === TriggerTypes.Date && startImmediately === StartImmediatelyValues.No) {
        const minDate = advancedSettings ? new Date(new Date().setDate(new Date().getDate() - 1)) : new Date();
        return Yup.date()
          .label('Start Date')
          .nullable()
          .min(minDate, ({ label }) => `${label} must be in the future.`)
          .required();
      }

      return schema.transform(() => null);
    }) as ConditionBuilder<MixedSchema>),
  startPrice: Yup.number()
    .label('Start Price')
    .positive()
    .nullable()
    .when(['startImmediately', 'triggerType'], {
      is: (startImmediately: StartImmediatelyValues, triggerType: TriggerTypes) =>
        triggerType === TriggerTypes.Price && startImmediately === StartImmediatelyValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  purchaseTime: Yup.string()
    .label('Purchase Time')
    .matches(timeFormat, {
      excludeEmptyString: true,
      message: ({ label }) => `${label} must be in the format HH:MM (24 hour time)`,
    })
    .when(['advancedSettings', 'startImmediately', 'triggerType'], {
      is: (advancedSettings: boolean, startImmediately: StartImmediatelyValues, triggerType: TriggerTypes) =>
        triggerType === TriggerTypes.Date &&
        advancedSettings === true &&
        startImmediately === StartImmediatelyValues.No,
      then: Yup.string().required(),
      otherwise: (schema) => schema.transform(() => ''),
    })
    .test({
      name: 'time-is-in-past',
      message: 'Date and time must be in the future',
      test(value, context) {
        if (!value?.match(timeFormat)) {
          return true;
        }
        const { startDate = new Date() } = { ...context.parent };
        if (!value || !startDate) {
          return false;
        }
        return new Date() <= combineDateAndTime(startDate, value);
      },
    }),
  executionInterval: Yup.mixed<ExecutionIntervals>().required(),
  swapAmount: Yup.number()
    .label('Swap Amount')
    .required()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return null;
      }
      return value;
    })

    .test({
      name: 'less-than-deposit',
      message: 'Swap amount must be less than initial deposit',
      test(value, context) {
        const { initialDeposit = 0 } = { ...context.parent, ...context.options.context };
        if (!value) {
          return true;
        }
        return value <= initialDeposit;
      },
    })
    .test({
      name: 'greater-than-minimum-swap',
      test(value, context) {
        if (isNil(value)) {
          return true;
        }
        const { initialDenom = null } = { ...context.parent, ...context.options.context };
        if (!initialDenom) {
          return true;
        }
        const { minimumSwapAmount = 0 } = getDenomInfo(initialDenom);

        if (value > minimumSwapAmount) {
          return true;
        }
        return context.createError({ message: `Swap amount should be greater than ${minimumSwapAmount}` });
      },
    }),
  slippageTolerance: Yup.number()
    .nullable()
    .label('Slippage Tolerance')
    .lessThan(100)
    .min(0)
    .when('advancedSettings', {
      is: true,
      then: (schema) => schema.required(),
    }),
  priceThresholdEnabled: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .required()
    .when('advancedSettings', {
      is: false,
      then: (schema) => schema.transform(() => YesNoValues.No),
    }),
  priceThresholdValue: Yup.number()
    .nullable()
    .label('Price Threshold')
    .positive()
    .when(['advancedSettings', 'priceThresholdEnabled'], {
      is: (advancedSettings: boolean, priceThresholdEnabled: YesNoValues) =>
        advancedSettings === true && priceThresholdEnabled === YesNoValues.Yes,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    })
    .test({
      name: 'less-than-price-trigger',
      message: 'Price ceiling must be greater than or equal to price trigger',
      test(value, context) {
        if (!value) {
          return true;
        }
        const { startPrice = undefined, strategyType = undefined } = { ...context.parent, ...context.options.context };
        if (!startPrice) {
          return true;
        }
        if (strategyType !== StrategyTypes.DCAIn) {
          return true;
        }
        return value >= startPrice;
      },
    })
    .test({
      name: 'greater-than-price-trigger',
      message: 'Price floor must be less than or equal to price trigger',
      test(value, context) {
        if (!value) {
          return true;
        }
        const { startPrice = undefined, strategyType = undefined } = { ...context.parent, ...context.options.context };
        if (!startPrice) {
          return true;
        }
        if (strategyType !== StrategyTypes.DCAOut) {
          return true;
        }
        return value <= startPrice;
      },
    }),
  sendToWallet: Yup.mixed<SendToWalletValues>().oneOf(Object.values(SendToWalletValues)).required(),
  recipientAccount: Yup.string()
    .label('Recipient Account')
    .nullable()
    .min(45)
    .max(45)
    .when('sendToWallet', {
      is: SendToWalletValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    })
    .test({
      name: 'starts-with-kujira',
      message: ({ label }) => `${label} must start with "kujira"`,
      test(value) {
        if (!value) {
          return true;
        }
        return value?.startsWith('kujira');
      },
    }),
  autoStake: Yup.mixed<AutoStakeValues>()
    .oneOf(Object.values(AutoStakeValues))
    .required()
    .when('sendToWallet', {
      is: SendToWalletValues.No,
      then: (schema) => schema.transform(() => AutoStakeValues.No),
    }),
  autoStakeValidator: Yup.string()
    .label('Validator')
    .nullable()
    .when(['autoStake', 'sendToWallet'], {
      is: (autoStake: AutoStakeValues, sendToWallet: SendToWalletValues) =>
        autoStake === AutoStakeValues.Yes && sendToWallet === SendToWalletValues.Yes,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  strategyDuration: Yup.number()
    .label('Strategy Duration')
    .min(MIN_DCA_PLUS_STRATEGY_DURATION)
    .max(MAX_DCA_PLUS_STRATEGY_DURATION)
    .required()
    .nullable()
    .test({
      name: 'swaps-greater-than-minimum',
      test(value, context) {
        if (isNil(value)) {
          return true;
        }
        const { initialDenom = null, initialDeposit = null } = { ...context.parent, ...context.options.context };
        if (!initialDenom || !initialDeposit) {
          return true;
        }
        const { minimumSwapAmount = 0 } = getDenomInfo(initialDenom);

        const maximumDurationFromDeposit = Math.ceil(initialDeposit / minimumSwapAmount);

        if (value < maximumDurationFromDeposit) {
          return true;
        }

        return context.createError({
          message: `Duration must be longer than ${maximumDurationFromDeposit} days. Increase your initial deposit to allow for a longer duration.`,
        });
      },
    }),
};

export const dcaSchema = Yup.object({
  resultingDenom: allSchema.resultingDenom,
  initialDenom: allSchema.initialDenom,
  initialDeposit: allSchema.initialDeposit,
  advancedSettings: allSchema.advancedSettings,
  startImmediately: allSchema.startImmediately,
  triggerType: allSchema.triggerType,
  startDate: allSchema.startDate,
  startPrice: allSchema.startPrice,
  purchaseTime: allSchema.purchaseTime,
  executionInterval: allSchema.executionInterval,
  swapAmount: allSchema.swapAmount,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
  sendToWallet: allSchema.sendToWallet,
  recipientAccount: allSchema.recipientAccount,
  autoStake: allSchema.autoStake,
  autoStakeValidator: allSchema.autoStakeValidator,
});
export type DcaInFormDataAll = Yup.InferType<typeof dcaSchema>;

export const step1ValidationSchema = dcaSchema.pick(['resultingDenom', 'initialDenom', 'initialDeposit']);
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const postPurchaseValidationSchema = dcaSchema.pick([
  'sendToWallet',
  'recipientAccount',
  'autoStake',
  'autoStakeValidator',
]);
export type DcaInFormDataPostPurchase = Yup.InferType<typeof postPurchaseValidationSchema>;

export const step2ValidationSchema = dcaSchema.pick([
  'advancedSettings',
  'startImmediately',
  'triggerType',
  'startDate',
  'startPrice',
  'purchaseTime',
  'executionInterval',
  'swapAmount',
  'slippageTolerance',
  'priceThresholdEnabled',
  'priceThresholdValue',
]);

export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;
