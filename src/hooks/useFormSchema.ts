import { useStateMachine } from 'little-state-machine';
import {
  allValidationSchema,
  basketOfAssetsSteps,
  initialValues,
  postPurchaseValidationSchema,
  step1ValidationSchema,
  step2ValidationSchema,
} from '../models/DcaInFormData';

export enum FormNames {
  DcaIn = 'dcaIn',
  DcaOut = 'dcaOut',
  BasketOfAssets = 'basketOfAssets',
}

const getFormState = (state: any, formName: FormNames) => state[formName] || {};

function getUpdateAction(formName: FormNames) {
  function updateAction(state: any, payload: any) {
    return {
      ...state,
      [formName]: {
        ...state[formName],
        ...payload,
      },
    };
  }
  return updateAction;
}

function getResetAction(formName: FormNames) {
  function resetAction(state: any) {
    return {
      ...state,
      [formName]: basketOfAssetsSteps[0].cast(initialValues, { stripUnknown: true }), // TODO: make generic
    };
  }
  return resetAction;
}

const useFormSchema = (formName: FormNames, formSchema: any, formStep: number) => {
  const { state, actions } = useStateMachine({
    updateAction: getUpdateAction(formName),
    resetAction: getResetAction(formName),
  });

  const stepState = {
    ...formSchema[formStep].cast(initialValues, { stripUnknown: true }),
    ...formSchema[formStep].cast(getFormState(state, formName), { stripUnknown: true }),
  };
  // formSchema is an array of all the steps in the form. Get me the array of all the steps previous to formStep
  const previousSteps = formSchema
    .slice(0, formStep)
    .map((step: any) => step.validateSync(getFormState(state, formName), { stripUnknown: true }));
  // formSchema is an array of all the steps in the form. Get me the array of all the steps previous to formStep

  return {
    state: [stepState, ...previousSteps],
    actions,
  };
};

export default useFormSchema;
