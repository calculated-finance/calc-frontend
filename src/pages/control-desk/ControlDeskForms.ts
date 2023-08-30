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
import YesNoValues from '../../models/YesNoValues';
import { StrategyTypes } from '../../models/StrategyTypes';
import { PostPurchaseOptions } from '../../models/PostPurchaseOptions';

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
  slippageTolerance: 2,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: null,
  sendToWallet: YesNoValues.Yes,
  recipientAccount: '',
  strategyDuration: 60,
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
  swapMultiplier: 1,
  applyMultiplier: YesNoValues.Yes,
  targetAmount: null,
};

const timeFormat = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
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
  applyCollateralisedMultiplier: Yup.mixed<YesNoValues>()
    .oneOf(Object.values(YesNoValues))
    .required()
    .when('advancedSettings', {
      is: false,
      then: (schema) => schema.transform(() => YesNoValues.Yes),
    }),
};

export const ctrlSchema = Yup.object({
  resultingDenom: allCtrlSchema.resultingDenom,
  initialDenom: allCtrlSchema.initialDenom,
  initialDeposit: allCtrlSchema.initialDeposit,
  advancedSettings: allCtrlSchema.advancedSettings,
  startDate: allCtrlSchema.startDate,
  startPrice: allCtrlSchema.startPrice,
  purchaseTime: allCtrlSchema.purchaseTime,
  swapAmount: allCtrlSchema.swapAmount,
  slippageTolerance: allCtrlSchema.slippageTolerance,
  priceThresholdEnabled: allCtrlSchema.priceThresholdEnabled,
  priceThresholdValue: allCtrlSchema.priceThresholdValue,
  sendToWallet: allCtrlSchema.sendToWallet,
  recipientAccount: allCtrlSchema.recipientAccount,
  postPurchaseOption: allCtrlSchema.postPurchaseOption,
  collateralisedMultiplier: allCtrlSchema.collateralisedMultiplier,
  applyCollateralisedMultiplier: allCtrlSchema.applyCollateralisedMultiplier,
  targetAmount: allCtrlSchema.targetAmount,
});
export type CtrlFormDataAll = Yup.InferType<typeof ctrlSchema>;

export const step1ValidationSchemaControlDesk = Yup.object({
  resultingDenom: allCtrlSchema.resultingDenom,
  initialDenom: allCtrlSchema.initialDenom,
  targetAmount: allCtrlSchema.targetAmount,
});
export type ControlDeskFormDataStep1 = Yup.InferType<typeof step1ValidationSchemaControlDesk>;

export const postPurchaseValidationSchemaControlDesk = ctrlSchema.pick([
  'postPurchaseOption',
  'sendToWallet',
  'recipientAccount',
  'collateralisedMultiplier',
  'applyCollateralisedMultiplier',
]);
export type ControlDeskFormDataPostPurchase = Yup.InferType<typeof postPurchaseValidationSchemaControlDesk>;

export const step2ValidationSchemaControlDesk = ctrlSchema.pick([
  'advancedSettings',
  'startDate',
  'startPrice',
  'purchaseTime',
  'swapAmount',
  'slippageTolerance',
  'priceThresholdEnabled',
  'priceThresholdValue',
  'collateralisedMultiplier',
  'applyCollateralisedMultiplier',
]);
export type ControlDeskFormDataStep2 = Yup.InferType<typeof step2ValidationSchemaControlDesk>;
