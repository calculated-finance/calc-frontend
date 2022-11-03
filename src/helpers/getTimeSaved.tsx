import totalExecutions from "@utils/totalExecutions";

const TIME_SAVED_PER_SWAP = 10;

export function getTimeSaved(deposit: number, swapAmount: number) {
  return totalExecutions(deposit, swapAmount) * TIME_SAVED_PER_SWAP
}
