export type PredictionModel = {
  truePositiveRate: number;
  falseNegativeRate: number;
  probabilityOfOutPerformance: number;
};

type PredictionData = Record<string, PredictionModel>;

export const predictionData: PredictionData = {
  Predict30: {
    truePositiveRate: 0.68,
    falseNegativeRate: 0.31,
    probabilityOfOutPerformance: 0.85,
  },
  Predict35: {
    truePositiveRate: 0.67,
    falseNegativeRate: 0.31,
    probabilityOfOutPerformance: 0.88,
  },
  Predict40: {
    truePositiveRate: 0.66,
    falseNegativeRate: 0.3,
    probabilityOfOutPerformance: 0.89,
  },
  Predict45: {
    truePositiveRate: 0.67,
    falseNegativeRate: 0.3,
    probabilityOfOutPerformance: 0.92,
  },
  Predict50: {
    truePositiveRate: 0.68,
    falseNegativeRate: 0.3,
    probabilityOfOutPerformance: 0.94,
  },
  Predict55: {
    truePositiveRate: 0.69,
    falseNegativeRate: 0.28,
    probabilityOfOutPerformance: 0.95,
  },
  Predict60: {
    truePositiveRate: 0.69,
    falseNegativeRate: 0.27,
    probabilityOfOutPerformance: 0.96,
  },
  Predict70: {
    truePositiveRate: 0.71,
    falseNegativeRate: 0.25,
    probabilityOfOutPerformance: 0.96,
  },
  Predict80: {
    truePositiveRate: 0.74,
    falseNegativeRate: 0.21,
    probabilityOfOutPerformance: 0.96,
  },
  Predict90: {
    truePositiveRate: 0.75,
    falseNegativeRate: 0.18,
    probabilityOfOutPerformance: 0.97,
  },
};
