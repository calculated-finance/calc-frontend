import getDenomInfo from '@utils/getDenomInfo';
import * as Yup from 'yup';
import { isNil } from 'rambda';
import { Coin } from 'src/interfaces/generated-osmosis/response/get_vault';
import YesNoValues from './YesNoValues';
import { ExecutionIntervals } from './ExecutionIntervals';
import { denomInfoSchema } from './DcaInFormData';

export const initialValues = {
  resultingDenom: undefined,
  initialDenom: undefined,
  initialDeposit: undefined,
  swapAmount: null,
  route: undefined,
  executionInterval: 'minute',
  executionIntervalIncrement: 1,
  priceThreshold: undefined,
  slippageTolerance: undefined,
  advancedSettings: false,
};

export const schema = Yup.object({
  initialDenom: Yup.object(denomInfoSchema).label('Initial Denom').required(),
  resultingDenom: Yup.object(denomInfoSchema).label('Resulting Denom').required(),
  initialDeposit: Yup.number()
    .label('Initial Deposit')
    .positive()
    .required()
    .nullable()
    .test({
      name: 'less-than-deposit',
      message: ({ label }) => `${label} must be less than or equal to than your current balance`,
      test(value, context) {
        const balances = context?.options?.context?.balances;
        if (!balances || !value || value <= 0) return true;
        const balance = balances.find((b: Coin) => b.denom === context.parent.initialDenom)?.amount;
        return balance && value <= Number(balance);
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

        return (
          value > minimumSwapAmount ||
          context.createError({ message: `Swap amount should be greater than ${minimumSwapAmount}` })
        );
      },
    }),
  route: Yup.string().notRequired(),
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
  priceThreshold: Yup.number()
    .label('Price Threshold')
    .positive()
    .when(['advancedSettings', 'priceThresholdEnabled'], {
      is: (advancedSettings: boolean, priceThresholdEnabled: YesNoValues) =>
        advancedSettings === true && priceThresholdEnabled === YesNoValues.Yes,
      then: (s) => s.required(),
      otherwise: (s) => s.transform(() => null),
    }),
  slippageTolerance: Yup.number()
    .label('Slippage Tolerance')
    .notRequired()
    .lessThan(100)
    .min(0)
    .default(initialValues.slippageTolerance)
    .when('advancedSettings', {
      is: true,
      then: (s) => s.required(),
      otherwise: (s) => s.transform(() => initialValues.slippageTolerance),
    }),
});

export type FormData = Yup.InferType<typeof schema>;
