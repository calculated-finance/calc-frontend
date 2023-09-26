import {
  assetsFormInitialValues,
  assetsFormSchema,
  dcaSchema,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '@models/DcaInFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { FormNames, useFormStore } from './useFormStore';
import { useWallet } from './useWallet';

export const getFormState = (state: any, formName: FormNames) => state[formName] || {};

export const useAssetsForm = () => {
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      state: {
        step1: assetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: (currentFormName: FormNames) => updateAction(currentFormName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: assetsFormSchema.cast(assetsFormInitialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: (currentFormName: FormNames) => updateAction(currentFormName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

const useDcaInForm = () => {
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      state: {
        step1: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: step1ValidationSchema.cast(initialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useStep2Form = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();
  const { formName } = useStrategyInfo();

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
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useDcaInFormPostPurchase = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();
  const { formName } = useStrategyInfo();

  try {
    return {
      context: step1ValidationSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...postPurchaseValidationSchema.cast(initialValues, { stripUnknown: true }),
        ...postPurchaseValidationSchema.cast(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useConfirmForm = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  try {
    return {
      state: dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
      errors: e,
    };
  }
};

export default useDcaInForm;
