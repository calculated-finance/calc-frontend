import { assetsFormInitialValues, assetsFormSchema, initialValues, simplifiedDcaIn } from '@models/DcaInFormData';
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

const useDcaInFormSimplified = () => {
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      state: simplifiedDcaIn.validateSync(getFormState(state, formName), { stripUnknown: true }),

      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: simplifiedDcaIn.cast(initialValues, { stripUnknown: true }),
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
      errors: e,
    };
  }
};

export default useDcaInFormSimplified;
