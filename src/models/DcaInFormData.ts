import { Denom } from '@hooks/usePairs';
import getDenomInfo from '@utils/getDenomInfo';
import AutoStakeValues from 'src/models/AutoStakeValues';
import SendToWalletValues from 'src/models/SendToWalletValues';
import { ExecutionIntervals } from 'src/models/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/models/StartImmediatelyValues';
import TriggerTypes from 'src/models/TriggerTypes';
import * as Yup from 'yup';

export const initialValues = {
  baseDenom: '',
  quoteDenom: '',
  initialDeposit: null,
  advancedSettings: false,
  startImmediately: StartImmediatelyValues.Yes,
  triggerType: TriggerTypes.Date,
  startDate: null,
  purchaseTime: '',
  startPrice: null,

  executionInterval: ExecutionIntervals.Daily,
  swapAmount: null,
  slippageTolerance: 1,
  sendToWallet: SendToWalletValues.Yes,
  autoStake: AutoStakeValues.No,
  recipientAccount: '',
  autoStakeValidator: '',
};

export const allValidationSchema = Yup.object({
  baseDenom: Yup.mixed<Denom>()
    .oneOf(Object.values(Denom), ({ label }) => `${label} is required.`)
    .label('Base Denom')
    .required(),
  quoteDenom: Yup.mixed<Denom>()
    .oneOf(Object.values(Denom), ({ label }) => `${label} is required.`)
    .label('Quote Denom')
    .required(),
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
        if (!balances) {
          return true;
        }
        const amount = balances.find((balance: any) => balance.denom === context.parent.quoteDenom)?.amount;
        if (!amount || !value) {
          return false;
        }
        return value <= getDenomInfo(context.parent.quoteDenom).conversion(Number(amount));
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
    .when(['startImmediately', 'triggerType'], {
      is: (startImmediately: StartImmediatelyValues, triggerType: TriggerTypes) =>
        triggerType === TriggerTypes.Date && startImmediately === StartImmediatelyValues.No,
      then: Yup.date()
        // TODO: be better at checking the future. Check if start time is set and then combine them.
        .min(new Date(new Date().setDate(new Date().getDate() - 1)), ({ label }) => `${label} must be in the future.`)
        .required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
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
    .matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, {
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
    }),
  executionInterval: Yup.mixed<ExecutionIntervals>().oneOf(Object.values(ExecutionIntervals)).required(),
  swapAmount: Yup.number()
    .label('Swap Amount')
    .positive()
    .required()
    .nullable()
    // can we do the below with .when()?
    .test({
      name: 'less-than-deposit',
      message: 'Swap amount must be less than initial deposit',
      test(value, context) {
        const { initialDeposit = 0 } = { ...context.parent, ...context.options.context };
        if (!value) {
          return false;
        }
        return value <= initialDeposit;
      },
    }),
  slippageTolerance: Yup.number()
    .nullable()
    .label('Slippage Tolerance')
    .lessThan(100)
    .moreThan(0)
    .when('advancedSettings', {
      is: true,
      then: (schema) => schema.required(),
    }),
  sendToWallet: Yup.mixed<SendToWalletValues>().oneOf(Object.values(SendToWalletValues)).required(),
  recipientAccount: Yup.string()
    .label('Recipient Account')
    .nullable()
    .when('sendToWallet', {
      is: SendToWalletValues.No,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
  autoStake: Yup.mixed<AutoStakeValues>().oneOf(Object.values(AutoStakeValues)).required(),
  autoStakeValidator: Yup.string()
    .label('Validator')
    .nullable()
    .when('autoStake', {
      is: AutoStakeValues.Yes,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.transform(() => null),
    }),
});
export type DcaInFormDataAll = Yup.InferType<typeof allValidationSchema>;

export const step1ValidationSchema = allValidationSchema.pick(['baseDenom', 'quoteDenom', 'initialDeposit']);
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const postPurchaseValidationSchema = allValidationSchema.pick([
  'sendToWallet',
  'recipientAccount',
  'autoStake',
  'autoStakeValidator',
]);
export type DcaInFormDataPostPurchase = Yup.InferType<typeof postPurchaseValidationSchema>;

export const step2ValidationSchema = allValidationSchema.pick([
  'advancedSettings',
  'startImmediately',
  'triggerType',
  'startDate',
  'startPrice',
  'purchaseTime',
  'executionInterval',
  'swapAmount',
  'slippageTolerance',
]);

export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;
