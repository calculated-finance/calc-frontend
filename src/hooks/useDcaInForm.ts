import { useStateMachine } from 'little-state-machine';
import DcaInFormData from '../types/DcaInFormData';

function updateAction(state: DcaInFormData, payload: DcaInFormData) {
  return {
    ...state,
    ...payload,
  };
}

function resetAction() {
  return { step1: {}, step2: {} };
}

const useDcaInForm = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  return {
    state,
    actions,
  };
};

export default useDcaInForm;
