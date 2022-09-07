import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    baseDenom: string;
    quoteDenom: string;
    initialDeposit: number;
    executionInterval: string;
    startDate: Date;
    swapAmount: number;
  }
}
