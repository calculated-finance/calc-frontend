import { getModel } from '../getModel';

export function getProbabilityOfOutPerformance(duration: number): number | null {
  const model = getModel(duration);
  return model ? model.probabilityOfOutPerformance : null;
}
