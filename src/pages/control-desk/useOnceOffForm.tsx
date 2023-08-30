import { initialValues } from '@models/DcaInFormData';
import { useWallet } from '@hooks/useWallet';
import { ControlDeskFormNames, useControlDeskFormStore } from './useControlDeskFormStore';
import { useControlDeskStrategyInfo } from './useControlDeskStrategyInfo';
import { ctrlSchema, postPurchaseValidationSchemaControlDesk, step1ValidationSchemaControlDesk, step2ValidationSchemaControlDesk } from './ControlDeskForms';

export const getFormStateControlDesk = (state: any, formName: ControlDeskFormNames) => state[formName] || {};

const useControlDeskForm = () => {

  const { formName } = useControlDeskStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();

  try {
    return {
      state: {
        step1: step1ValidationSchemaControlDesk.validateSync(getFormStateControlDesk(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: step1ValidationSchemaControlDesk.cast(initialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useStep2FormControlDesk = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { address } = useWallet();
  const { formName } = useControlDeskStrategyInfo()

  try {
    const step1 = step1ValidationSchemaControlDesk.validateSync(getFormStateControlDesk(state, formName), { stripUnknown: true });
    const step2 = {
      ...step2ValidationSchemaControlDesk.cast(initialValues, { stripUnknown: true }),
      ...step2ValidationSchemaControlDesk.cast(getFormStateControlDesk(state, formName), { stripUnknown: true }),
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

export const useControlDeskFormPostPurchase = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { address } = useWallet();
  const { formName } = useControlDeskStrategyInfo()

  try {
    return {
      context: step1ValidationSchemaControlDesk.validateSync(getFormStateControlDesk(state, formName), { stripUnknown: true }),
      state: {
        ...postPurchaseValidationSchemaControlDesk.cast(initialValues, { stripUnknown: true }),
        ...postPurchaseValidationSchemaControlDesk.cast(getFormStateControlDesk(state, formName), { stripUnknown: true }),
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

export const useConfirmFormControlDesk = () => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useControlDeskFormStore();
  const { formName } = useControlDeskStrategyInfo();
  const { address } = useWallet();
  try {
    ctrlSchema.validateSync(getFormStateControlDesk(state, formName), { stripUnknown: true });

    return {
      state: ctrlSchema.validateSync(getFormStateControlDesk(state, formName), { stripUnknown: true }),
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
