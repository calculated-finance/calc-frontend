const TIME_SAVED_PER_SWAP = 10;

export function getStrategyTimeSaved(balance: number, swapAmount: number) {
  // this will result in 10 minutes for things close to 0
  return Math.ceil((balance || 0) / swapAmount) * TIME_SAVED_PER_SWAP
}
