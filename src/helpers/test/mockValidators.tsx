import { REST_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { ValidatorsResponse } from '@hooks/useValidators';

export function mockValidators() {
  nock(REST_ENDPOINT)
    .get('/cosmos/staking/v1beta1/validators')
    .query({ 'pagination.limit': '1000' })
    .reply(200, {
      pagination: {
        next_key: '',
        total: '',
      },
      validators: [
        {
          operator_address: 'kujiravalopertestvalidator',
          description: {
            moniker: 'test',
          },
          jailed: false,
        },
      ],
    } as ValidatorsResponse);
}
