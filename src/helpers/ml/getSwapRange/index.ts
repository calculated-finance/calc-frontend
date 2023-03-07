import { getModel } from '../getModel';

export function getSwapRange(swapAmount: number, duration: number) {
  const model = getModel(duration);

  if (model) {
    const { truePositiveRate, falseNegativeRate } = model;

    const min = (0.45 * swapAmount) / truePositiveRate;
    const max = (0.45 * swapAmount) / falseNegativeRate;

    return { min, max };
  }
  return null;
}
