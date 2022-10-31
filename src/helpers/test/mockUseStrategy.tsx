// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockTimeTrigger } from 'src/fixtures/trigger';
import { UseStrategyResponse } from '@hooks/useStrategy';
import mockStrategyData from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

export function mockUseStrategy(data: Partial<UseStrategyResponse> = {}) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_vault: {
        vault_id: '1',
        address: 'kujitestwallet',
      },
    })
    .mockResolvedValueOnce({ vault: mockStrategy(), trigger: mockTimeTrigger, ...data });
  return queryContractSmart;
}
