export default interface FormData {
  baseDenom: string;
  quoteDenom: string;
  initialDeposit: number;
  executionInterval: string;
  startDate: Date;
  swapAmount: number;
}
