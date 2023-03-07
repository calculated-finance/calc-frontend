import { getModel } from '../getModel';

export function getProbabilityOfOutperformance(duration: number): number | null {
  const model = getModel(duration);
  return model ? model.probabilityOfOutperformance : null;
}
