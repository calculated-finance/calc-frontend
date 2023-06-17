import {
  DcaPlusAssetsFormSchema,
  DcaPlusConfirmFormSchema,
  DcaPlusCustomiseFormSchema,
  DcaPlusPostPurchaseFormSchema,
} from '@models/dcaPlusFormData';
import { initialValues } from '@models/DcaInFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { getFormState } from './useDcaInForm';
import {  useFormStore } from './useFormStore';
import { useWallet } from './useWallet';

export const useDCAPlusAssetsForm = () => {
  const { formName } = useStrategyInfo();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    return {
      state: {
        step1: DcaPlusAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: DcaPlusAssetsFormSchema.cast(initialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useDCAPlusStep2Form = () => {
  const { formName } = useStrategyInfo();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

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

export const useDcaPlusInFormPostPurchase = () => {
  const { formName } = useStrategyInfo();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    return {
      context: DcaPlusAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...DcaPlusPostPurchaseFormSchema.cast(initialValues, { stripUnknown: true }),
        ...DcaPlusPostPurchaseFormSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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

export const useDcaPlusConfirmForm = () => {
  const { formName } = useStrategyInfo();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    DcaPlusConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: DcaPlusConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
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
