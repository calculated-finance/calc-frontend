import { useStateMachine } from 'little-state-machine';
import DcaInFormData, { initialValues } from '../types/DcaInFormData';

function updateAction(state: DcaInFormData, payload: DcaInFormData) {
  return {
    ...state,
    ...payload,
  };
}

function resetAction() {
  return initialValues;
}

const useDcaInForm = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  return {
    state,
    actions,
  };
};

export default useDcaInForm;
