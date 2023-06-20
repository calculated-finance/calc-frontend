// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { dcaInStrategy } from 'src/fixtures/strategy';
import { Strategy } from '@models/Strategy';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { QueryMsg } from 'src/interfaces/v2/generated/query';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...dcaInStrategy,
    ...data,
  };
}

export function mockUseStrategy(data: Partial<VaultResponse> = {}) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_events_by_resource_id: {
        resource_id: '1',
      },
    } as QueryMsg)
    .mockResolvedValueOnce({ vault: mockStrategy(), ...data });
  return queryContractSmart;
}
