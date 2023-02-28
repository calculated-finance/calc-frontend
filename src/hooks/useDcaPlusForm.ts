import { DcaPlusSteps, dcaPlusSteps } from '@models/dcaPlusFormData';
import { useStateMachine } from 'little-state-machine';
import { initialValues } from '../models/DcaInFormData';
import { FormNames, getFormState, getResetAction, getUpdateAction } from './useDcaInForm';

export const useDCAPlusStep2Form = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    const step1 = dcaPlusSteps[DcaPlusSteps.ASSETS].validateSync(getFormState(state, formName), { stripUnknown: true });
    const step2 = {
      ...dcaPlusSteps[DcaPlusSteps.CUSTOMISE].cast(initialValues, { stripUnknown: true }),
      ...dcaPlusSteps[DcaPlusSteps.CUSTOMISE].cast(getFormState(state, formName), { stripUnknown: true }),
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

export const useDcaPlusInFormPostPurchase = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    return {
      context: dcaPlusSteps[DcaPlusSteps.ASSETS].validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...dcaPlusSteps[DcaPlusSteps.POST_PURCHASE].cast(initialValues, { stripUnknown: true }),
        ...dcaPlusSteps[DcaPlusSteps.POST_PURCHASE].cast(getFormState(state, formName), { stripUnknown: true }),
      },
      actions,
    };
  } catch (e) {
    return {
      actions,
    };
  }
};

export const useDcaPlusConfirmForm = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    dcaPlusSteps[DcaPlusSteps.CONFIRM].validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: dcaPlusSteps[DcaPlusSteps.CONFIRM].validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    return {
      actions,
      errors: e,
    };
  }
};
