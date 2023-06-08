import {
  WeightedScaleAssetsFormSchema,
  WeightedScaleConfirmFormSchema,
  WeightedScaleCustomiseFormSchema,
  WeightedScalePostPurchaseFormSchema,
} from '@models/weightedScaleFormData';
import { initialValues } from '@models/DcaInFormData';
import { getFormState } from './useDcaInForm';
import { FormNames, useFormStore } from './useFormStore';
import { useWallet } from './useWallet';

export const useWeightedScaleAssetsForm = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    return {
      state: {
        step1: WeightedScaleAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: WeightedScaleAssetsFormSchema.cast(initialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

export const useWeightedScaleStep2Form = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    const step1 = WeightedScaleAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true });
    const step2 = {
      ...WeightedScaleCustomiseFormSchema.cast(initialValues, { stripUnknown: true }),
      ...WeightedScaleCustomiseFormSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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

export const useWeightedScaleInFormPostPurchase = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    return {
      context: WeightedScaleAssetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      state: {
        ...WeightedScalePostPurchaseFormSchema.cast(initialValues, { stripUnknown: true }),
        ...WeightedScalePostPurchaseFormSchema.cast(getFormState(state, formName), { stripUnknown: true }),
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

export const useWeightedScaleConfirmForm = (formName: FormNames) => {
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();
  const { address } = useWallet();

  try {
    WeightedScaleConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true });

    return {
      state: WeightedScaleConfirmFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
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
