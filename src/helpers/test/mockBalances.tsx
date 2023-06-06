// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { Coin } from '@cosmjs/stargate';

export function mockBalances() {
  const balancesSpy = jest.fn();
  when(balancesSpy)
    .expectCalledWith('kujiratestwallet')
    .mockResolvedValue([
      {
        denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
        amount: (88.12 * 1000000).toString(),
      },
      {
        denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
        amount: (50 * 1000000).toString(),
      },
      {
        denom: 'ukuji',
        amount: (50 * 1000000).toString(),
      },
    ] as Coin[]);
  return balancesSpy;
}
