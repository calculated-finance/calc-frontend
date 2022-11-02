import { REST_ENDPOINT } from 'src/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';

export function mockBalances() {
  nock(REST_ENDPOINT)
    .get('/cosmos/bank/v1beta1/balances/kujitestwallet')
    .reply(200, {
      balances: [
        {
          denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
          amount: (88.12 * 1000000).toString(),
        },
        {
          denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
          amount: (50 * 1000000).toString(),
        },
      ],
    });
}
