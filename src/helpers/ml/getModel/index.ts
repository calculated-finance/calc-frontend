import { predictionData, PredictionModel } from './predictionData';

export function getModel(duration: number): PredictionModel | null {
  if (duration >= 30 && duration < 35) {
    return predictionData.Predict30;
  }
  if (duration >= 35 && duration < 40) {
    return predictionData.Predict35;
  }
  if (duration >= 40 && duration < 45) {
    return predictionData.Predict40;
  }
  if (duration >= 45 && duration < 50) {
    return predictionData.Predict45;
  }
  if (duration >= 50 && duration < 55) {
    return predictionData.Predict50;
  }
  if (duration >= 55 && duration < 60) {
    return predictionData.Predict55;
  }
  if (duration >= 60 && duration < 70) {
    return predictionData.Predict60;
  }
  if (duration >= 70 && duration <= 80) {
    return predictionData.Predict70;
  }
  if (duration > 80 && duration < 90) {
    return predictionData.Predict80;
  }
  if (duration >= 90) {
    return predictionData.Predict90;
  }
  return null;
}

export function getModelFromId(id: number | undefined): PredictionModel | null {
  switch (id) {
    case 30:
      return predictionData.Predict30;
    case 35:
      return predictionData.Predict35;
    case 40:
      return predictionData.Predict40;
    case 45:
      return predictionData.Predict45;
    case 50:
      return predictionData.Predict50;
    case 55:
      return predictionData.Predict55;
    case 60:
      return predictionData.Predict60;
    case 70:
      return predictionData.Predict70;
    case 80:
      return predictionData.Predict80;
    case 90:
      return predictionData.Predict90;
    default:
      return null;
  }
}
