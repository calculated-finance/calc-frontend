import { getModel } from '../getModel';
import { PredictionModel } from '../getModel/predictionData';

export function getSwapRangeFromModel(swapAmount: number, model: PredictionModel | null, miniumSwapAmount: number) {
  if (model) {
    const { truePositiveRate, falseNegativeRate } = model;

    const min = (0.45 * swapAmount) / truePositiveRate;
    const max = (0.45 * swapAmount) / falseNegativeRate;

    return { min: Math.max(miniumSwapAmount, Number(min.toFixed(3))), max: Number(max.toFixed(3)) };
  }
  return null;
}

export function getSwapRange(swapAmount: number, duration: number, miniumSwapAmount: number) {
  const model = getModel(duration);
  return getSwapRangeFromModel(swapAmount, model, miniumSwapAmount);
}
