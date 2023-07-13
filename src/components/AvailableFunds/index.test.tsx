import { defaultDenom } from '@utils/defaultDenom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Formik } from 'formik';
import { useWallet } from '@hooks/useWallet';
import useFiatPrice from '@hooks/useFiatPrice';
import useBalance from '@hooks/useBalance';
import { AvailableFunds } from '.';

jest.mock('@hooks/useFiatPrice');
jest.mock('@hooks/useBalance');
jest.mock('@hooks/useWallet');

describe('available funds component', () => {
  const mockResultingDenom = { ...defaultDenom, id: 'ukuji' };

  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
    });
    (useFiatPrice as jest.Mock).mockReturnValue({
      price: 23,
    });
    (useBalance as jest.Mock).mockReturnValue({
      data: {
        denom: 'ukuji',
        amount: '10000000',
      },
    });
  });

  describe('connect wallet button link', () => {
    it('shows connect wallet when not connected', () => {
      (useWallet as jest.Mock).mockReturnValue({
        connected: false,
      });

      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );

      expect(screen.getByText(/Connect wallet/)).toBeInTheDocument();
    });

    it('does not show connect wallet when connected', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );

      expect(screen.getByText(/None/)).toBeInTheDocument();
    });
  });

  describe('Get funds button link', () => {
    it('Display amount shows in available funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      expect(screen.getByText(/9.995652/)).toBeInTheDocument();
    });

    it('Get funds button appears when no funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      expect(screen.getByText(/Get funds/)).toBeInTheDocument();
      expect(screen.getByTestId('get-funds-button')).toBeInTheDocument();
    });

    it('None appears when no funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      expect(screen.getByText(/None/)).toBeInTheDocument();
    });
  });
});
