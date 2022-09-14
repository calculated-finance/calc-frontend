type DcaInFormDataStep1 = {
  baseDenom?: string;
  quoteDenom?: string;
  initialDeposit?: number;
};

type DcaInFormDataStep2 = {
  executionInterval?: string;
  startDate?: Date;
  swapAmount?: number;
};

export default interface DcaInFormData {
  step1: DcaInFormDataStep1;
  step2: DcaInFormDataStep2;
}
