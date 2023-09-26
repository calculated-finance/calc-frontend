import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import { ExecutionIntervals } from 'src/models/ExecutionIntervals';
import TriggerTypes from 'src/models/TriggerTypes';
import * as Yup from 'yup';
import { combineDateAndTime } from '@helpers/combineDateAndTime';
import { ConditionBuilder } from 'yup/lib/Condition';
import { MixedSchema } from 'yup/lib/mixed';
import { isNil } from 'lodash';
import {
  DCA_PLUS_MIN_SWAP_COEFFICIENT,
  MAX_DCA_PLUS_STRATEGY_DURATION,
  MIN_DCA_PLUS_STRATEGY_DURATION,
} from 'src/constants';
import { getChainAddressLength, getChainAddressPrefix } from '@helpers/chains';
import { Coin } from 'src/interfaces/generated-osmosis/response/get_vault';
import YesNoValues from './YesNoValues';
import { StrategyTypes } from './StrategyTypes';
import { PostPurchaseOptions } from './PostPurchaseOptions';

export type AssetsFormValues = Yup.InferType<typeof assetsFormSchema>;

export const assetsFormInitialValues = {
  strategyType: '',
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: null,
};

export const assetsFormSchema = Yup.object({
  strategyType: Yup.mixed<StrategyTypes>().required(),
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
    })
    .test({
      name: 'greater-than-minimum-deposit',
      test(value, context) {
        if (isNil(value)) {
          return true;
        }
        const { initialDenom = null, strategyType = null } = { ...context.parent, ...context.options.context };
        if (!initialDenom) {
          return true;
        }

        if (strategyType !== StrategyTypes.DCAPlusIn && strategyType !== StrategyTypes.DCAPlusOut) {
          return true;
        }
        const { minimumSwapAmount = 0 } = getDenomInfo(initialDenom);

        const dcaPlusMinimumDeposit =
          minimumSwapAmount * DCA_PLUS_MIN_SWAP_COEFFICIENT * MIN_DCA_PLUS_STRATEGY_DURATION;

        if (value > dcaPlusMinimumDeposit) {
          return true;
        }

        return context.createError({
          message: `Initial deposit must be more than ${dcaPlusMinimumDeposit} ${getDenomName(
            getDenomInfo(initialDenom),
          )}, otherwise the minimum swap amount will decay performance. We recommend depositing at least $50 worth of assets.`,
        });
      },
    }),
});

export const initialValues = {
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: null,
  advancedSettings: false,
  startImmediately: YesNoValues.Yes,
  triggerType: TriggerTypes.Date,
  startDate: null,
  purchaseTime: '',
  startPrice: null,
  executionInterval: 'daily',
  executionIntervalIncrement: 1,
  swapAmount: null,
  slippageTolerance: 2,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: null,
  sendToWallet: YesNoValues.Yes,
  recipientAccount: '',
  autoStakeValidator: '',
  autoCompoundStakingRewards: true,
  strategyDuration: 60,
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
  yieldOption: null,
  reinvestStrategy: '',
  basePriceIsCurrentPrice: YesNoValues.Yes,
  basePriceValue: null,
  swapMultiplier: 1,
  applyMultiplier: YesNoValues.Yes,
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
  startImmediately: Yup.mixed<YesNoValues>().oneOf(Object.values(YesNoValues)).required(),
  triggerType: Yup.mixed<TriggerTypes>()
    .oneOf(Object.values(TriggerTypes))
    .required()
    .when('startImmediately', {
      is: YesNoValues.Yes,
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
      if (triggerType === TriggerTypes.Date && startImmediately === YesNoValues.No) {
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
      is: (startImmediately: YesNoValues, triggerType: TriggerTypes) =>
        triggerType === TriggerTypes.Price && startImmediately === YesNoValues.No,
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
      is: (advancedSettings: boolean, startImmediately: YesNoValues, triggerType: TriggerTypes) =>
        triggerType === TriggerTypes.Date && advancedSettings === true && startImmediately === YesNoValues.No,
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
  executionIntervalIncrement: Yup.number()
    .label('Increment')
    .required()
    .positive()
    .integer()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return null;
      }
      return value;
    }),
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
    .label('Slippage Tolerance')
    .lessThan(100)
    .min(0)
    .default(initialValues.slippageTolerance)
    .when('advancedSettings', {
      is: true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => initialValues.slippageTolerance),
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
        if (strategyType !== StrategyTypes.DCAIn && strategyType !== StrategyTypes.WeightedScaleIn) {
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
        if (strategyType !== StrategyTypes.DCAOut && strategyType !== StrategyTypes.WeightedScaleOut) {
          return true;
        }
        return value <= startPrice;
      },
    }),
  postPurchaseOption: Yup.mixed<PostPurchaseOptions>(),
  sendToWallet: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .required()
    .when('postPurchaseOption', {
      is: PostPurchaseOptions.SendToWallet,
      then: (schema) => schema,
      otherwise: (schema) => schema.transform(() => YesNoValues.Yes),
    }),
  recipientAccount: Yup.string()
    .label('Recipient Account')
    .nullable()
    .when('sendToWallet', {
      is: YesNoValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => ''),
    })
    .test({
      name: 'correct-length',
      message: ({ label }) => `${label} is not a valid address`,
      test(value, context) {
        if (!value) {
          return true;
        }
        const { chain } = context.options.context || {};
        if (!chain) {
          return true;
        }
        return value?.length === getChainAddressLength(chain);
      },
    })

    .test({
      name: 'starts-with-chain-prefix',
      message: ({ label }) => `${label} has an invalid prefix`,
      test(value, context) {
        if (!value) {
          return true;
        }
        const { chain } = context.options.context || {};
        if (!chain) {
          return true;
        }
        return value?.startsWith(getChainAddressPrefix(chain));
      },
    }),
  autoStakeValidator: Yup.string()
    .label('Validator')
    .nullable()
    .when(['postPurchaseOption'], {
      is: PostPurchaseOptions.Stake,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  autoCompoundStakingRewards: Yup.bool().label('Auto-compound Staking Rewards'),
  yieldOption: Yup.string()
    .label('Yield Option')
    .nullable()
    .when('postPurchaseOption', {
      is: PostPurchaseOptions.GenerateYield,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  reinvestStrategy: Yup.string()
    .label('Reinvest Strategy')
    .nullable()
    .when('postPurchaseOption', {
      is: PostPurchaseOptions.Reinvest,
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

        const maximumDurationFromDeposit = Math.ceil(
          initialDeposit / (minimumSwapAmount * DCA_PLUS_MIN_SWAP_COEFFICIENT),
        );

        if (value < maximumDurationFromDeposit) {
          return true;
        }

        return context.createError({
          message: `Duration must be less than ${maximumDurationFromDeposit} days. Increase your initial deposit to allow for a longer duration.`,
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
  executionIntervalIncrement: allSchema.executionIntervalIncrement,
  swapAmount: allSchema.swapAmount,
  slippageTolerance: allSchema.slippageTolerance,
  priceThresholdEnabled: allSchema.priceThresholdEnabled,
  priceThresholdValue: allSchema.priceThresholdValue,
  sendToWallet: allSchema.sendToWallet,
  recipientAccount: allSchema.recipientAccount,
  autoStakeValidator: allSchema.autoStakeValidator,
  autoCompoundStakingRewards: allSchema.autoCompoundStakingRewards,
  postPurchaseOption: allSchema.postPurchaseOption,
  yieldOption: allSchema.yieldOption,
  reinvestStrategy: allSchema.reinvestStrategy,
});
export type DcaInFormDataAll = Yup.InferType<typeof dcaSchema>;

export const step1ValidationSchema = Yup.object({
  resultingDenom: allSchema.resultingDenom,
  initialDenom: allSchema.initialDenom,
  initialDeposit: allSchema.initialDeposit,
});
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const postPurchaseValidationSchema = dcaSchema.pick([
  'postPurchaseOption',
  'sendToWallet',
  'recipientAccount',
  'autoStakeValidator',
  'autoCompoundStakingRewards',
  'yieldOption',
  'reinvestStrategy',
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
  'executionIntervalIncrement',
  'swapAmount',
  'slippageTolerance',
  'priceThresholdEnabled',
  'priceThresholdValue',
]);
export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;

export const simplifiedDcaIn = dcaSchema.pick([
  'initialDenom',
  'resultingDenom',
  'swapAmount',
  'initialDeposit',
  'executionInterval',
  'executionIntervalIncrement',
  'sendToWallet',
]);
export type SimplifiedDcaInFormData = Yup.InferType<typeof simplifiedDcaIn>;
