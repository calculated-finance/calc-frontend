import {
  DcaPlusAssetsFormSchema,
  DcaPlusConfirmFormSchema,
  DcaPlusCustomiseFormSchema,
  DcaPlusPostPurchaseFormSchema,
} from '@models/dcaPlusFormData';
import { useStateMachine } from 'little-state-machine';
import { initialValues } from '../models/DcaInFormData';
import { FormNames, getFormState, getResetAction, getUpdateAction } from './useDcaInForm';

export const useDCAPlusStep2Form = (formName: FormNames) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  try {
    const step1 = DcaPlusAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true });
    const step2 = {
      ...DcaPlusCustomiseFormSchema.cast(initialValues, { stripUnknown: true }),
      ...DcaPlusCustomiseFormSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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
      context: DcaPlusAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...DcaPlusPostPurchaseFormSchema.cast(initialValues, { stripUnknown: true }),
        ...DcaPlusPostPurchaseFormSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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
    DcaPlusConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: DcaPlusConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions,
    };
  } catch (e) {
    return {
      actions,
      errors: e,
    };
  }
};
