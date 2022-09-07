export type FormData = {
  baseDenom: string;
  quoteDenom: string;
  initialDeposit: number;
  executionInterval: string;
  startDate: Date;
  swapAmount: number;
};

export default function updateAction(state: FormData, payload: any) {
  console.log('state:', state);
  console.log('payload:', payload);
  return {
    ...state,
    ...payload,
  };
}
