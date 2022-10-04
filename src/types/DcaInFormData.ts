import { ExecutionIntervals } from 'src/pages/create-strategy/dca-in/step2/ExecutionIntervals';
import { StartImmediatelyValues } from 'src/pages/create-strategy/dca-in/step2/StartImmediatelyValues';
import * as Yup from 'yup';

export const initialValues = {
  baseDenom: '',
  quoteDenom: '',
  initialDeposit: null,
  advancedSettings: false,
  startImmediately: StartImmediatelyValues.Yes,
  startDate: null,
  purchaseTime: '',
  executionInterval: ExecutionIntervals.Daily,
  swapAmount: null,
};

export const allValidationSchema = Yup.object({
  baseDenom: Yup.string().label('Base Denom').required(), // TODO: make these denom enums,
  quoteDenom: Yup.string().label('Quote Denom').required(), // TODO: make these denom enums,
  initialDeposit: Yup.number().label('Initial Deposit').positive().required().nullable(),
  advancedSettings: Yup.boolean(),
  startImmediately: Yup.mixed<StartImmediatelyValues>().oneOf(Object.values(StartImmediatelyValues)).required(),
  startDate: Yup.mixed()
    .label('Start Date')
    .nullable()
    .when('startImmediately', {
      is: StartImmediatelyValues.No,
      then: Yup.date()
        // TODO: be better at checking the future
        // check if start time is set and then combine them.
        // maybe we just combine these fields into one and have one data point?
        // though that will be harder to save
        .min(new Date(new Date().setDate(new Date().getDate() - 1)), ({ label }) => `${label} must be in the future.`)
        .required(),
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
});
export type DcaInFormDataAll = Yup.InferType<typeof allValidationSchema>;

export const step1ValidationSchema = allValidationSchema.pick(['baseDenom', 'quoteDenom', 'initialDeposit']);
export type DcaInFormDataStep1 = Yup.InferType<typeof step1ValidationSchema>;

export const step2ValidationSchema = allValidationSchema.pick([
  'advancedSettings',
  'startImmediately',
  'startDate',
  'purchaseTime',
  'executionInterval',
  'swapAmount',
]);

export type DcaInFormDataStep2 = Yup.InferType<typeof step2ValidationSchema>;
