import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import { Strategy } from '@models/Strategy';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...dcaInStrategyViewModal,
    ...data,
  };
}
