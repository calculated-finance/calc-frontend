import {
  dcaSchema,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '@models/DcaInFormData';
import { FormNames, useFormStore } from './useFormStore';

export const getFormState = (state: any, formName: FormNames) => state[formName] || {};

const useDcaInForm = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      state: {
        step1: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: step1ValidationSchema.cast(initialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useStep2Form = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    const step1 = step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true });
    const step2 = {
      ...step2ValidationSchema.cast(initialValues, { stripUnknown: true }),
      ...step2ValidationSchema.cast(getFormState(state, formName), { stripUnknown: true }),
    };

    return {
      state: {
        step1,
        step2,
      },
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useDcaInFormPostPurchase = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      context: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...postPurchaseValidationSchema.cast(initialValues, { stripUnknown: true }),
        ...postPurchaseValidationSchema.cast(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useConfirmForm = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName),
        resetAction: resetAction(formName),
      },
      errors: e,
    };
  }
};

export default useDcaInForm;
