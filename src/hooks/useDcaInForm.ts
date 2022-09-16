import { useStateMachine } from 'little-state-machine';
import DcaInFormData from '../types/DcaInFormData';

function updateAction(state: DcaInFormData, payload: DcaInFormData) {
  return {
    ...state,
    ...payload,
  };
}

export const initialValues = {
  step1: {
    baseDenom: '',
    quoteDenom: '',
    initialDeposit: 0,
  },
  step2: {
    startImmediately: true,
    startDate: undefined,
    executionInterval: 'daily',
    swapAmount: 0,
  },
};

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
