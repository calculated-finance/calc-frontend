// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import strategy from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';
import { VaultResponse } from 'src/interfaces/v2/generated/response/get_vault';
import { QueryMsg } from 'src/interfaces/v2/generated/query';
import { GET_EVENTS_LIMIT } from '@hooks/useStrategyEvents';
import pairs from 'src/fixtures/pairs';

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
        limit: GET_EVENTS_LIMIT,
        start_after: null,
      },
    } as QueryMsg)
    .mockResolvedValue({ events: [] });

  when(queryContractSmart)
    .calledWith(CONTRACT_ADDRESS, {
      get_config: {},
    })
    .mockResolvedValue({ pairs });
  return queryContractSmart;
}
