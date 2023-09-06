import getDenomInfo from '@utils/getDenomInfo';
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
import YesNoValues from '../../../models/YesNoValues';
import { StrategyTypes } from '../../../models/StrategyTypes';
import { PostPurchaseOnceOffOptions } from '../create-strategy/PostPurchaseOnceOffOptions';

export const initialCtrlValues = {
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: null,
  advancedSettings: false,
  triggerType: TriggerTypes.Date,
  startDate: null,
  purchaseTime: '',
  startPrice: null,
  executionInterval: 'daily',
  executionIntervalIncrement: 1,
  swapAmount: null,
  slippageTolerance: 0.5,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: null,
  sendToWallet: YesNoValues.No,
  recipientArray: [],
  strategyDuration: 60,
  postPurchaseOption: PostPurchaseOnceOffOptions.SinglePayment,
  targetAmount: null,
  collateralisedMultiplier: 1,
  totalCollateralisedAmount: null,
  endDate: null,
  endTime: '',
  calcCalculateSwaps: YesNoValues.Yes,
  calcCalculatedSwapsEnabled: YesNoValues.Yes,
  totalRecipients: 1,
};

const timeFormat = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

export const recipientSchema = Yup.object().shape({
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
});

export const allCtrlSchema = {
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
  targetAmount: Yup.number().label('Target Amount').positive().required().nullable(),
  advancedSettings: Yup.boolean(),
  endDate: Yup.mixed()
    .label('End Date')
    .nullable()
    .when((() => {
      const minDate = new Date(new Date().setDate(new Date().getDate() - 1));
      return Yup.date()
        .label('End Date')
        .nullable()
        .min(minDate, ({ label }) => `${label} must be in the future.`)
        .required();
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
  endTime: Yup.string()
    .label('End Time')
    .matches(timeFormat, {
      excludeEmptyString: true,
      message: ({ label }) => `${label} must be in the format HH:MM (24 hour time)`,
    })
    .when(['advancedSettings'], {
      is: (advancedSettings: boolean) => advancedSettings === true,
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
        const { endDate = new Date() } = { ...context.parent };
        if (!value || !endDate) {
          return false;
        }
        return new Date() <= combineDateAndTime(endDate, value);
      },
    }),
  swapAmount: Yup.number()
    .label('Swap Amount')
    .nullable()
    .when(['calcCalculatedSwapsEnabled'], {
      is: (calcCalculatedSwapsEnabled: YesNoValues) => calcCalculatedSwapsEnabled === YesNoValues.No,
      then: Yup.number().required(),
    })
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
        const { totalCollateralisedAmount = 0 } = { ...context.parent, ...context.options.context };
        if (!value) {
          return true;
        }
        return value <= totalCollateralisedAmount;
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
  executionInterval: Yup.mixed().when('calcCalculatedSwapsEnabled', {
    is: YesNoValues.No,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.transform(() => initialCtrlValues.executionInterval),
  }),
  executionIntervalIncrement: Yup.number()
    .label('Increment')
    .positive()
    .integer()
    .nullable()
    .when('calcCalculatedSwapsEnabled', {
      is: YesNoValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => initialCtrlValues.executionIntervalIncrement),
    }),
  slippageTolerance: Yup.number()
    .label('Slippage Tolerance')
    .lessThan(100)
    .min(0)
    .default(initialCtrlValues.slippageTolerance)
    .when('advancedSettings', {
      is: true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => initialCtrlValues.slippageTolerance),
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
  calcCalculatedSwapsEnabled: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .default(YesNoValues.Yes)
    .required(),
  calcCalculateSwaps: Yup.mixed<YesNoValues>().oneOf(Object.values(YesNoValues)),
  // .when(['calcCalculatedSwapsEnabled'], {
  //   is: (calcCalculatedSwapsEnabled: YesNoValues) => calcCalculatedSwapsEnabled === YesNoValues.Yes,
  //   then: (schema) => schema.required(),
  //   otherwise: (schema) => schema.transform(() => null),
  // }),
  postPurchaseOption: Yup.mixed<PostPurchaseOnceOffOptions>(),
  sendToWallet: Yup.mixed<YesNoValues>().oneOf(Object.values(YesNoValues)).required(),
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
  collateralisedMultiplier: Yup.number().required(),
  totalCollateralisedAmount: Yup.number().nullable().required(),
  totalRecipients: Yup.number(),
  recipientsArray: Yup.array().of(recipientSchema),
};

export const ctrlSchema = Yup.object({
  resultingDenom: allCtrlSchema.resultingDenom,
  initialDenom: allCtrlSchema.initialDenom,
  advancedSettings: allCtrlSchema.advancedSettings,
  startPrice: allCtrlSchema.startPrice,
  slippageTolerance: allCtrlSchema.slippageTolerance,
  priceThresholdEnabled: allCtrlSchema.priceThresholdEnabled,
  priceThresholdValue: allCtrlSchema.priceThresholdValue,
  sendToWallet: allCtrlSchema.sendToWallet,
  postPurchaseOption: allCtrlSchema.postPurchaseOption,
  collateralisedMultiplier: allCtrlSchema.collateralisedMultiplier,
  totalCollateralisedAmount: allCtrlSchema.totalCollateralisedAmount,
  targetAmount: allCtrlSchema.targetAmount,
  calcCalculatedSwaps: allCtrlSchema.calcCalculateSwaps,
  calcCalculatedSwapsEnabled: allCtrlSchema.calcCalculatedSwapsEnabled,
  endDate: allCtrlSchema.endDate,
  endTime: allCtrlSchema.endTime,
  swapAmount: allCtrlSchema.swapAmount,
  executionInterval: allCtrlSchema.executionInterval,
  executionIntervalIncrement: allCtrlSchema.executionIntervalIncrement,
  totalRecipients: allCtrlSchema.totalRecipients,
  recipientsArray: allCtrlSchema.recipientsArray,
});
export type CtrlFormDataAll = Yup.InferType<typeof ctrlSchema>;

export const step1ValidationSchemaControlDesk = Yup.object({
  resultingDenom: allCtrlSchema.resultingDenom,
  initialDenom: allCtrlSchema.initialDenom,
  targetAmount: allCtrlSchema.targetAmount,
  collateralisedMultiplier: allCtrlSchema.collateralisedMultiplier,
  totalCollateralisedAmount: allCtrlSchema.totalCollateralisedAmount,
});
export type ControlDeskFormDataStep1 = Yup.InferType<typeof step1ValidationSchemaControlDesk>;

export const step2ValidationSchemaControlDesk = ctrlSchema.pick([
  'advancedSettings',
  'slippageTolerance',
  'priceThresholdEnabled',
  'priceThresholdValue',
  'calcCalculatedSwaps',
  'calcCalculatedSwapsEnabled',
  'totalCollateralisedAmount',
  'endDate',
  'endTime',
  'swapAmount',
  'executionInterval',
  'executionIntervalIncrement',
  'totalRecipients',
]);
export type ControlDeskFormDataStep2 = Yup.InferType<typeof step2ValidationSchemaControlDesk>;

export const postPurchaseValidationSchemaControlDesk = ctrlSchema.pick([
  'postPurchaseOption',
  'sendToWallet',
  'recipientsArray',
]);

export type ControlDeskFormDataPostPurchase = Yup.InferType<typeof postPurchaseValidationSchemaControlDesk>;

export const confirmFormSchemaControlDesk = ctrlSchema;
