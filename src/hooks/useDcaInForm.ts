import { useStateMachine } from 'little-state-machine';
import {
  allValidationSchema,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '../models/DcaInFormData';

export enum FormNames {
  DcaIn = 'dcaIn',
  DcaOut = 'dcaOut',
}

const getFormState = (state: any, formName: FormNames) => state[formName] || {};

function getUpdateAction(formName: FormNames) {
  function updateAction(state: any, payload: any) {
    return {
      ...state,
      [formName]: {
        ...state[formName],
        ...payload,
      },
    };
  }
  return updateAction;
}

function getResetAction(formName: FormNames) {
  function resetAction(state: any) {
    return {
      ...state,
      [formName]: allValidationSchema.cast(initialValues, { stripUnknown: true }),
    };
  }
  return resetAction;
}

export enum Steps {
  Step1 = 'step1',
  Step2 = 'step2',
}

const useDcaInForm = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    return {
      state: {
        step1: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions,
    };
  } catch (e) {
    return {
      state: {
        step1: step1ValidationSchema.cast(initialValues, { stripUnknown: true }),
      },
      actions,
    };
  }
};

export const useStep2Form = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    const step1 = step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true });
    const step2 = {
      ...step2ValidationSchema.cast(initialValues, { stripUnknown: true }),
      ...step2ValidationSchema.cast(state, { stripUnknown: true }),
    };

    return {
      state: {
        step1,
        step2,
      },
      actions,
    };
  } catch (e) {
    return {
      actions,
    };
  }
};

export const useDcaInFormPostPurchase = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    return {
      context: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: postPurchaseValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    return {
      context: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: postPurchaseValidationSchema.cast(initialValues, { stripUnknown: true }),
      actions,
    };
  }
};

export const useConfirmForm = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    allValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: allValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    return {
      actions,
      errors: e,
    };
  }
};

export default useDcaInForm;
