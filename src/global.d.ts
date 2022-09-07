import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState extends FormData {
    baseDenom: string;
    quoteDenom: string;
    initialDeposit: number;
    executionInterval: string;
    startDate: Date;
    swapAmount: number;
  }
}
