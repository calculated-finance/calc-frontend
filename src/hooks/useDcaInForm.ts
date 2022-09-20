import { useStateMachine } from 'little-state-machine';
import {
  allValidationSchema,
  initialValues,
  step1ValidationSchema,
  step2ValidationSchema,
} from '../types/DcaInFormData';

function updateAction(state: any, payload: any) {
  return {
    ...state,
    ...payload,
  };
}

function resetAction() {
  return allValidationSchema.cast(initialValues, { stripUnknown: true });
}

export enum Steps {
  Step1 = 'step1',
  Step2 = 'step2',
}

const useDcaInForm = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  try {
    return {
      state: {
        step1: step1ValidationSchema.validateSync(state, { stripUnknown: true }),
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

export const useStep2Form = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  try {
    const step1 = step1ValidationSchema.validateSync(state, { stripUnknown: true });
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

export const useConfirmForm = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  try {
    allValidationSchema.validateSync(state, { stripUnknown: true });

    return {
      state: allValidationSchema.validateSync(state, { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    console.log(e);
    return {
      actions,
      errors: e,
    };
  }
};

export default useDcaInForm;
