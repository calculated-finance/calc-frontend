// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockTimeTrigger } from 'src/fixtures/trigger';
import strategy from 'src/fixtures/strategy';
import { Strategy } from '@hooks/useStrategies';
import { VaultResponse } from 'src/interfaces/generated/response/get_vault';

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
        address: 'kujitestwallet',
      },
    })
    .mockResolvedValueOnce({ vault: mockStrategy(), ...data });
  return queryContractSmart;
}
