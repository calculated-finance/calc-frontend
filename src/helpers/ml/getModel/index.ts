import { predictionData, PredictionModel } from './predictionData';

export function getModel(duration: number): PredictionModel | null {
  if (duration >= 30 && duration <= 32) {
    return predictionData.Predict30;
  }
  if (duration >= 33 && duration <= 38) {
    return predictionData.Predict35;
  }
  if (duration >= 39 && duration <= 44) {
    return predictionData.Predict40;
  }
  if (duration >= 45 && duration <= 51) {
    return predictionData.Predict45;
  }
  if (duration >= 52 && duration <= 57) {
    return predictionData.Predict50;
  }
  if (duration >= 58 && duration <= 65) {
    return predictionData.Predict55;
  }
  if (duration >= 66 && duration <= 77) {
    return predictionData.Predict60;
  }
  if (duration >= 78 && duration <= 96) {
    return predictionData.Predict70;
  }
  if (duration > 97 && duration <= 123) {
    return predictionData.Predict80;
  }
  if (duration >= 124) {
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
