import { ExecutionIntervals } from 'src/pages/create-strategy/dca-in/step2/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/pages/create-strategy/dca-in/step2/StartImmediatelyValues';
import * as Yup from 'yup';

export const initialValues = {
  baseDenom: '',
  quoteDenom: '',
  initialDeposit: null,
  startImmediately: StartImmediatelyValues.Yes,
  startDate: null,
  executionInterval: ExecutionIntervals.Daily,
  swapAmount: null,
};

export const allValidationSchema = Yup.object({
  baseDenom: Yup.string().label('Base Denom').required(), // TODO: make these denom enums,
  quoteDenom: Yup.string().label('Quote Denom').required(), // TODO: make these denom enums,
  initialDeposit: Yup.number().label('Initial Deposit').positive().required().nullable(),
  startImmediately: Yup.mixed<StartImmediatelyValues>().oneOf(Object.values(StartImmediatelyValues)).required(),
  startDate: Yup.date()
    .label('Start Date')
    .min(new Date(), ({ label }) => `${label} must be in the future.`)
    .nullable()
    .default(null)
    .when('startImmediately', {
      is: StartImmediatelyValues.No,
      then: Yup.date().required(),
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
});
export type DcaInFormDataAll = Yup.InferType<typeof allValidationSchema>;

export const step1ValidationSchema = allValidationSchema.pick(['baseDenom', 'quoteDenom', 'initialDeposit']);
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const step2ValidationSchema = allValidationSchema.pick([
  'startImmediately',
  'startDate',
  'executionInterval',
  'swapAmount',
]);

export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;
