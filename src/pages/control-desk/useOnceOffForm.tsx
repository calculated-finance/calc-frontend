import {
  dcaSchema,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '@models/DcaInFormData';
import { useWallet } from '@hooks/useWallet';
import { ControlDeskFormNames, useControlDeskFormStore } from './useControlDeskFormStore';
import { useControlDeskStrategyInfo } from './useControlDeskStrategyInfo';

export const getFormState = (state: any, formName: ControlDeskFormNames) => state[formName] || {};

const useControlDeskForm = () => {

  const { formName } = useControlDeskStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();

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
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { address } = useWallet();
  const { formName } = useControlDeskStrategyInfo()

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
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { address } = useWallet();
  const { formName } = useControlDeskStrategyInfo()

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
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { formName } = useControlDeskStrategyInfo();
  const { address } = useWallet();
  try {
    dcaSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

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

export default useControlDeskForm;
