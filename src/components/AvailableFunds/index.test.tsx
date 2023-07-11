import { defaultDenom } from '@utils/defaultDenom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Formik } from 'formik';
import useBalance, { getDisplayAmount } from '@hooks/useBalance';
import { createStrategyFeeInTokens } from '@helpers/createStrategyFeeInTokens';
import useFiatPrice from '@hooks/useFiatPrice';
import { useWallet } from '@hooks/useWallet';
import { AvailableFunds } from '.';

jest.mock('@hooks/useFiatPrice');
jest.mock('@hooks/useBalance');
jest.mock('@hooks/useWallet');

describe('available funds component', () => {
  const mockResultingDenom = { ...defaultDenom, id: 'mockDenomId' };

  describe('connect wallet button link', () => {
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

      expect(screen.getByText(/None/)).toBeInTheDocument();
    });
  });

  describe('Get funds button link', () => {
    const mockInitialDenom = { ...defaultDenom, id: 'mockDenomId' };

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
    const { price } = useFiatPrice(mockInitialDenom);
    const { data } = useBalance(mockInitialDenom);
    const createStrategyFee = price ? Number(createStrategyFeeInTokens(price)) : 0;
    const balance = Number(data?.amount);
    const displayAmount = getDisplayAmount(mockInitialDenom, Math.max(balance - createStrategyFee, 0));

    it('Display amount shows in available funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      if (displayAmount) {
        expect(screen.getByText(displayAmount)).toBeInTheDocument();
      }
    });

    it('Get funds button appears when no funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      if (!displayAmount) {
        expect(screen.getByText(/Get funds/)).toBeInTheDocument();
        expect(screen.getByTestId('get-funds-button')).toBeInTheDocument();
      }
    });

    it('None appears when no funds', () => {
      render(
        <Formik initialValues={{ initalDenom: 'ukuji' }} onSubmit={jest.fn()}>
          <AvailableFunds denom={mockResultingDenom} />
        </Formik>,
      );
      if (!displayAmount) {
        expect(screen.getByText(/None/)).toBeInTheDocument();
      }
    });
  });
});
