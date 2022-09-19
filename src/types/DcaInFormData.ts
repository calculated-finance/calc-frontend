import { ExecutionIntervals } from 'src/pages/create-strategy/dca-in/step2/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/pages/create-strategy/dca-in/step2/StartImmediatelyValues';
import * as Yup from 'yup';

// can we set these in yup?
export const initialValues = {
  step1: {
    baseDenom: '',
    quoteDenom: '',
    initialDeposit: undefined,
  },
  step2: {
    startImmediately: StartImmediatelyValues.Yes,
    startDate: null,
    executionInterval: 'daily',
    swapAmount: '',
  },
};

const baseDenom = Yup.string().label('Base Denom').required();
const quoteDenom = Yup.string().required('This is required');
const initialDeposit = Yup.number().positive('Must be positive').required('This is required');

export const step1ValidationSchema = Yup.object({
  baseDenom,
  quoteDenom,
  initialDeposit,
});

export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

const startImmediately = Yup.mixed<StartImmediatelyValues>().oneOf(Object.values(StartImmediatelyValues)).required();

const startDate = Yup.date().when('showEmail', {
  is: false,
  then: Yup.string().required('This is required'),
});

const executionInterval = Yup.mixed<ExecutionIntervals>().oneOf(Object.values(ExecutionIntervals)).required();

const swapAmount = Yup.number().positive().required();

export const step2ValidationSchema = Yup.object({
  startImmediately,
  startDate,
  executionInterval,
  swapAmount,
});

export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;

export const allValidationSchema = Yup.object({
  baseDenom,
  quoteDenom,
  initialDeposit,
  startImmediately,
  startDate,
  executionInterval,
  swapAmount: swapAmount.test('less-than-deposit', (value, context) => {
    const { initialDeposit: initialDepositValue } = context.parent;
    return value! <= initialDepositValue;
  }),
});

export type DcaInFormDataAll = Yup.InferType<typeof allValidationSchema>;

export default interface DcaInFormData {
  step1: DcaInFormDataStep1;
  step2: DcaInFormDataStep2;
}
