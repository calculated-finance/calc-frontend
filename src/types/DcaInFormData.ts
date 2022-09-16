import * as Yup from 'yup';

export type DcaInFormDataStep1 = {
  baseDenom?: string;
  quoteDenom?: string;
  initialDeposit?: number;
};

export type DcaInFormDataStep2 = {
  startImmediately?: boolean;
  executionInterval?: string;
  startDate?: Date;
  swapAmount?: number;
};

export const dcaInValidationSchema = Yup.object({
  baseDenom: Yup.string().required(),
  quoteDenom: Yup.string().required(),
  initialDeposit: Yup.number().positive().required(),
  startImmediately: Yup.boolean().required(),
  startDate: Yup.date().required(),
  executionInterval: Yup.string().required(),
  swapAmount: Yup.number().positive().required(),
  somethingElse: Yup.number(),
});

export const stepOneValidationSchema = Yup.object({
  startImmediately: Yup.boolean().required(),
  startDate: Yup.date().required(),
  executionInterval: Yup.string().required(),
  swapAmount: Yup.number().positive().required(),
});

export default interface DcaInFormData {
  step1: DcaInFormDataStep1;
  step2: DcaInFormDataStep2;
}
