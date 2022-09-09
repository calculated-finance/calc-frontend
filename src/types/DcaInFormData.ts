export default interface DcaInFormData {
  baseDenom?: string;
  quoteDenom?: string;
  initialDeposit?: number;
  executionInterval?: string;
  startDate?: Date;
  swapAmount?: number;
}
