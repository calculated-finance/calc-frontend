// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import mockStrategyData from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';
import pairs from 'src/fixtures/pairs';

export function mockPairs(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

export function mockGetPairs() {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_pairs: {},
    })
    .mockResolvedValue({ pairs });
  return queryContractSmart;
}
