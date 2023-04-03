import { useStateMachine } from 'little-state-machine';
import {
  dcaSchema,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '@models/DcaInFormData';

export enum FormNames {
  DcaIn = 'dcaIn',
  DcaOut = 'dcaOut',
  DcaPlusIn = 'dcaPlusIn',
  DcaPlusOut = 'dcaPlusOut',
}

export const getFormState = (state: any, formName: FormNames) => state[formName] || {};

export function getUpdateAction(formName: FormNames) {
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

export function getResetAction(formName: FormNames) {
  function resetAction(state: any) {
    return {
      ...state,
      [formName]: dcaSchema.cast(initialValues, { stripUnknown: true }),
    };
  }
  return resetAction;
}

export enum Steps {
  Step1 = 'step1',
  Step2 = 'step2',
}

const useDcaOutForm = (formName: FormNames) => {
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
      ...step2ValidationSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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

export const useDcaOutFormPostPurchase = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    return {
      context: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...postPurchaseValidationSchema.cast(initialValues, { stripUnknown: true }),
        ...postPurchaseValidationSchema.cast(getFormState(state, formName), { stripUnknown: true }),
      },
      actions,
    };
  } catch (e) {
    return {
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
    dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    return {
      actions,
      errors: e,
    };
  }
};

export default useDcaOutForm;
