import { getModel } from '../getModel';
import { PredictionModel } from '../getModel/predictionData';

const PREDICT_10_TRUE_POSITIVE_RATE = 0.7;
const PREDICT_10_FALSE_NEGATIVE_RATE = 0.31;

export function getSwapRangeFromModel(swapAmount: number, model: PredictionModel | null, miniumSwapAmount: number) {
  if (model) {
    const { truePositiveRate, falseNegativeRate } = model;

    const minNoise = (0.45 * swapAmount) / PREDICT_10_TRUE_POSITIVE_RATE - swapAmount;
    const maxNoise = (0.45 * swapAmount) / PREDICT_10_FALSE_NEGATIVE_RATE - swapAmount;

    const minBase = (0.45 * swapAmount) / truePositiveRate;
    const maxBase = (0.45 * swapAmount) / falseNegativeRate;

    const min = minBase + 0.05 * minNoise;
    const max = maxBase + 0.05 * maxNoise;

    return { min: Math.max(miniumSwapAmount, Number(min.toFixed(3))), max: Number(max.toFixed(3)) };
  }
  return null;
}

export function getSwapRange(swapAmount: number, duration: number, miniumSwapAmount: number) {
  const model = getModel(duration);
  return getSwapRangeFromModel(swapAmount, model, miniumSwapAmount);
}
