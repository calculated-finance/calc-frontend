export function getSwapAmountFromDuration(initialDeposit: number, strategyDuration: number): number {
  return initialDeposit / strategyDuration;
}
