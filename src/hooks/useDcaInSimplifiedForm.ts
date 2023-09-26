import { dcaSchema, initialValues } from '@models/DcaInFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { FormNames, useFormStore } from './useFormStore';
import { useWallet } from './useWallet';

export const getFormState = (state: any, formName: FormNames) => state[formName] || {};

const useDcaInFormSimplified = () => {
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

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
      state: dcaSchema.cast(initialValues, { stripUnknown: true }),
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
      errors: e,
    };
  }
};

export default useDcaInFormSimplified;
