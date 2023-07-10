import { defaultDenom } from '@utils/defaultDenom';
import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import useBalance from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { AvailableFunds } from '.';

jest.mock('@hooks/useFiatPrice');
jest.mock('@hooks/useBalance');

describe('available funds', () => {
  it('shows connect wallet when not connected', () => {
    const mockResultingDenom = { ...defaultDenom, id: 'mockDenomId' };
    (useFiatPrice as jest.Mock).mockReturnValue({
      price: 23,
    });
    (useBalance as jest.Mock).mockReturnValue({
      price: 23,
    });

    render(
      <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
        <AvailableFunds denom={mockResultingDenom} />
      </Formik>,
    );

    expect(screen.getByText(/Connect wallet/)).toBeInTheDocument();
  });
});
