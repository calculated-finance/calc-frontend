// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';

export function mockGetBalance() {
  const getBalance = jest.fn();
  when(getBalance)
    .calledWith('kujiratestwallet', 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo')
    .mockResolvedValue({ amount: (88.12 * 1000000).toString() });

  when(getBalance)
    .calledWith('kujiratestwallet', 'ukuji')
    .mockResolvedValue({ amount: (12.12 * 1000000).toString() });

  return getBalance;
}
