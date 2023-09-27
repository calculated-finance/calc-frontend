import { FormNames, useFormStore } from '@hooks/useFormStore';
import { useWallet } from '@hooks/useWallet';
import { dcaSchema } from '@models/DcaInFormData';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';

export const getFormState = (state: any, formName: FormNames) => state[formName] || {};

export const useConfirmFormSimple = () => {
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
      // state: dcaSchema.cast(initialValues, { stripUnknown: true }),
      actions: {
        updateAction: updateAction(formName, address),
        resetAction: resetAction(formName),
      },
      errors: e,
    };
  }
};
