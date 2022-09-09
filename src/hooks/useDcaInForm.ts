import { useStateMachine } from 'little-state-machine';

function updateAction(state: any, payload: any) {
  return {
    ...state,
    ...payload,
  };
}

function resetAction() {
  return {};
}

const useDcaInForm = () => {
  const { state, actions } = useStateMachine({ updateAction, resetAction });

  return {
    state,
    actions,
  };
};

export default useDcaInForm;
