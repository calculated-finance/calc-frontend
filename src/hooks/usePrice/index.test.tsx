import { TransactionType } from '@components/TransactionType';
import { Denoms } from '@models/Denom';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { Denom } from 'kujira.js/lib/cjs/fin';
import { mockBook } from 'src/helpers/test/mockBook';
import { mockUseWallet } from 'src/helpers/test/mockUseWallet';
import { queryClient } from 'src/pages/_app.page';
import usePrice from '.';

jest.mock('@wizard-ui/react');

describe.skip('usePrice', () => {
  test('should return price', async () => {
    const mockBookSpy = mockBook('kujira12cks8zuclf9339tnanpdd8z8ycf5ygdgy885sejc7kyhvryzfyzsvjpasw', {
      base: [
        {
          quote_price: '0.00019999',
          offer_denom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E' as unknown as Denom,
          total_offer_amount: '33600000000',
        },
      ],
      quote: [
        {
          quote_price: '4798000000',
          offer_denom:
            'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk' as unknown as Denom,
          total_offer_amount: '500000',
        },
      ],
    });
    mockUseWallet(mockBookSpy);
    const { result } = renderHook(() => usePrice(Denoms.NBTC, Denoms.USK, TransactionType.Buy), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    });
    expect(result.current).toEqual(1);
  });
});
