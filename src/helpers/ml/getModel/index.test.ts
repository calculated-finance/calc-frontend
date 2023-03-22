import { getModel, getModelFromId } from '.';
import { predictionData } from './predictionData';
describe('getModel', () => {
  it('should return null when duration is less than 30', () => {
    expect(getModel(20)).toBe(null);
  });

  it('should return Predict30 when duration is between 30 and 32', () => {
    expect(getModel(31)).toBe(predictionData.Predict30);
  });

  it('should return Predict35 when duration is between 33 and 38', () => {
    expect(getModel(35)).toBe(predictionData.Predict35);
  });

  it('should return Predict40 when duration is between 39 and 44', () => {
    expect(getModel(40)).toBe(predictionData.Predict40);
  });

  it('should return Predict45 when duration is between 45 and 51', () => {
    expect(getModel(47)).toBe(predictionData.Predict45);
  });

  it('should return Predict50 when duration is between 52 and 57', () => {
    expect(getModel(54)).toBe(predictionData.Predict50);
  });

  it('should return Predict55 when duration is between 58 and 65', () => {
    expect(getModel(60)).toBe(predictionData.Predict55);
  });

  it('should return Predict60 when duration is between 66 and 77', () => {
    expect(getModel(70)).toBe(predictionData.Predict60);
  });

  it('should return Predict70 when duration is between 78 and 96', () => {
    expect(getModel(90)).toBe(predictionData.Predict70);
  });

  it('should return Predict80 when duration is between 97 and 123', () => {
    expect(getModel(100)).toBe(predictionData.Predict80);
  });

  it('should return Predict90 when duration is greater than 124', () => {
    expect(getModel(130)).toBe(predictionData.Predict90);
  });
});

describe('getModelFromId', () => {
  it('should return null when id is undefined', () => {
    expect(getModelFromId(undefined)).toBe(null);
  });

  it('should return Predict30 when id is 30', () => {
    expect(getModelFromId(30)).toBe(predictionData.Predict30);
  });

  it('should return Predict35 when id is 35', () => {
    expect(getModelFromId(35)).toBe(predictionData.Predict35);
  });

  it('should return Predict40 when id is 40', () => {
    expect(getModelFromId(40)).toBe(predictionData.Predict40);
  });

  it('should return Predict45 when id is 45', () => {
    expect(getModelFromId(45)).toBe(predictionData.Predict45);
  });

  it('should return Predict50 when id is 50', () => {
    expect(getModelFromId(50)).toBe(predictionData.Predict50);
  });

  it('should return Predict55 when id is 55', () => {
    expect(getModelFromId(55)).toBe(predictionData.Predict55);
  });

  it('should return Predict60 when id is 60', () => {
    expect(getModelFromId(60)).toBe(predictionData.Predict60);
  });

  it('should return Predict70 when id is 70', () => {
    expect(getModelFromId(70)).toBe(predictionData.Predict70);
  });

  it('should return Predict80 when id is 80', () => {
    expect(getModelFromId(80)).toBe(predictionData.Predict80);
  });

  it('should return Predict90 when id is 90', () => {
    expect(getModelFromId(90)).toBe(predictionData.Predict90);
  });

  it('should return null when id is not one of the expected values', () => {
    expect(getModelFromId(25)).toBe(null);
  });
});
