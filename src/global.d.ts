import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    step1: {
      baseDenom?: string;
      quoteDenom?: string;
      initialDeposit?: number;
    };
    step2: {
      startImmediately?: boolean;
      executionInterval?: string;
      startDate?: Date;
      swapAmount?: number;
    };
  }
}
