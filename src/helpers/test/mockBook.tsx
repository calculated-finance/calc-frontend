// eslint-disable-next-line import/no-extraneous-dependencies
import { when } from 'jest-when';
import { BookResponse } from 'kujira.js/lib/cjs/fin';

export function mockBook(pairAddress: string, bookData: BookResponse) {
  const queryContractSmart = jest.fn();
  when(queryContractSmart)
    .calledWith(pairAddress, {
      book: {
        limit: 1,
      },
    })
    .mockResolvedValue(bookData);
  return queryContractSmart;
}
