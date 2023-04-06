// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { QueryValidatorsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query';

export function mockValidators() {
  const validatorsSpy = jest.fn();
  when(validatorsSpy)
    .expectCalledWith('BOND_STATUS_BONDED')
    .mockResolvedValue({
      validators: [
        {
          operatorAddress: 'kujiravalopertestvalidator',
          description: {
            moniker: 'test',
          },
          jailed: false,
        },
      ],
    } as QueryValidatorsResponse);
  return validatorsSpy;
}
