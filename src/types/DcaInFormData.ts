import { Denom } from '@hooks/usePairs';
import AutoStakeValues from "src/pages/create-strategy/dca-in/post-purchase/AutoStakeValues";
import SendToWalletValues from "src/pages/create-strategy/dca-in/post-purchase/SendToWalletValues";
import { ExecutionIntervals } from 'src/pages/create-strategy/dca-in/step2/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/pages/create-strategy/dca-in/step2/StartImmediatelyValues';
import TriggerTypes from 'src/pages/create-strategy/dca-in/step2/TriggerTypes';
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
  executionInterval: ExecutionIntervals.Daily,
  swapAmount: null,
  slippageTolerance: 1,
  sendToWallet: SendToWalletValues.Yes,
  autoStake: AutoStakeValues.No,
};

export const allValidationSchema = Yup.object({
  baseDenom: Yup.mixed<Denom>().oneOf(Object.values(Denom)).label('Base Denom').required(),
  quoteDenom: Yup.mixed<Denom>().oneOf(Object.values(Denom)).label('Quote Denom').required(),
  initialDeposit: Yup.number().label('Initial Deposit').positive().required().nullable(),
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
    .when(['advancedSettings', 'startImmediately'], {
      is: (advancedSettings: boolean, startImmediately: StartImmediatelyValues) =>
        advancedSettings === true && startImmediately === StartImmediatelyValues.No,
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
      otherwise: (schema) => schema.transform(() => null),
    }),
  sendToWallet: Yup.mixed<SendToWalletValues>().oneOf(Object.values(SendToWalletValues)).required(),
  autoStake: Yup.mixed<AutoStakeValues>().oneOf(Object.values(AutoStakeValues)).required(),
});
export type DcaInFormDataAll = Yup.InferType<typeof allValidationSchema>;

export const step1ValidationSchema = allValidationSchema.pick(['baseDenom', 'quoteDenom', 'initialDeposit']);
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const postPurchaseValidationSchema = allValidationSchema.pick(['sendToWallet', 'autoStake']);
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
