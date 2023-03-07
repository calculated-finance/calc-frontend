import { getModel } from '.';
import { predictionData } from './predictionData';

describe('getModel', () => {
  test('returns null for duration less than 30', () => {
    expect(getModel(20)).toBeNull();
  });

  test('returns correct model for duration between 30 and 35', () => {
    expect(getModel(31)).toEqual(predictionData.Predict30);
  });

  test('returns correct model for duration between 35 and 40', () => {
    expect(getModel(38)).toEqual(predictionData.Predict35);
  });

  test('returns correct model for duration between 40 and 45', () => {
    expect(getModel(43)).toEqual(predictionData.Predict40);
  });

  test('returns correct model for duration between 45 and 50', () => {
    expect(getModel(48)).toEqual(predictionData.Predict45);
  });

  test('returns correct model for duration between 50 and 55', () => {
    expect(getModel(53)).toEqual(predictionData.Predict50);
  });

  test('returns correct model for duration between 55 and 60', () => {
    expect(getModel(58)).toEqual(predictionData.Predict55);
  });

  test('returns correct model for duration between 60 and 70', () => {
    expect(getModel(67)).toEqual(predictionData.Predict60);
  });

  test('returns correct model for duration between 70 and 80', () => {
    expect(getModel(73)).toEqual(predictionData.Predict70);
  });

  test('returns correct model for duration between 80 and 90', () => {
    expect(getModel(85)).toEqual(predictionData.Predict80);
  });

  test('returns correct model for duration greater than 90', () => {
    expect(getModel(100)).toEqual(predictionData.Predict90);
  });
});
