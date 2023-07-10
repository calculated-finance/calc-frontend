import { defaultDenom } from '@utils/defaultDenom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Formik } from 'formik';
import useBalance from '@hooks/useBalance';
import useFiatPrice from '@hooks/useFiatPrice';
import { useWallet } from '@hooks/useWallet';
import { AvailableFunds } from '.';

jest.mock('@hooks/useFiatPrice');
jest.mock('@hooks/useBalance');
jest.mock('@hooks/useWallet');

describe('available funds', () => {
  const mockResultingDenom = { ...defaultDenom, id: 'mockDenomId' };

  (useFiatPrice as jest.Mock).mockReturnValue({
    price: 23,
  });

  (useBalance as jest.Mock).mockReturnValue({
    data: {
      denom: 'ukuji',
      amount: '1',
    },
  });

  it('shows connect wallet when not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
    });

    render(
      <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
        <AvailableFunds denom={mockResultingDenom} />
      </Formik>,
    );

    expect(screen.getByText(/Connect wallet/)).toBeVisible();
  });

  it('does not show connect wallet when connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
    });

    render(
      <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
        <AvailableFunds denom={mockResultingDenom} />
      </Formik>,
    );

    expect(screen.getByText(/None/)).toContainHTML('button');
    expect(screen.getByText(/None/)).toBeInTheDocument();
    expect(screen.getByText(/None/)).toBeDisabled();
  });
});
