// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS, DEFAULT_PAGE_SIZE } from 'src/constants';
import strategy from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';
import { QueryMsg } from 'src/interfaces/generated/query';

export function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...strategy,
    ...data,
  };
}

export function mockUseStrategy(data: Partial<VaultResponse> = {}) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_vault: {
        vault_id: '1',
      },
    })
    .mockResolvedValueOnce({ vault: mockStrategy(), ...data });

  // strategy events
  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_events_by_resource_id: {
        resource_id: '1',
        limit: DEFAULT_PAGE_SIZE,
      },
    } as QueryMsg)
    .mockResolvedValueOnce({ events: [] });
  return queryContractSmart;
}
