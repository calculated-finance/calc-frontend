import { fireEvent, render, screen, waitFor, within, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockUseStrategy } from '@helpers/test/mockGetVault';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/strategies/top-up',
  query: { id: '1' },
  events: {
    on: jest.fn(),
  },
};

const mockToast = jest.fn();

jest.mock('@hooks/useWallet');
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

// jest.mock('next/router');
// const useRouterMock = useRouter as jest.Mock;

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

function mockDeposit(execute = jest.fn(), success = true) {
  const msg = {
    deposit: {
      vault_id: '1',
      address: 'kujitestwallet',
    },
  };
  if (success) {
    when(execute)
      .calledWith('kujitestwallet', CONTRACT_ADDRESS, msg, 'auto', undefined, [
        { amount: '1000000', denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo' },
      ])
      .mockResolvedValueOnce('');
  } else {
    when(execute)
      .calledWith('kujitestwallet', CONTRACT_ADDRESS, msg, 'auto', undefined, [
        { amount: '1000000', denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo' },
      ])
      .mockRejectedValueOnce(new Error('test error'));
  }
  return execute;
}

async function renderTarget() {
  act(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );
  });
}

describe('Top up page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the heading', async () => {
    mockUseWallet(mockUseStrategy(), mockDeposit(), mockGetBalance());

    await renderTarget();

    expect(within(screen.getByTestId('strategy-modal-header')).getByText('Top Up Strategy')).toBeInTheDocument();
  });
  it('renders remaining balance', async () => {
    mockUseWallet(mockUseStrategy(), mockDeposit(), mockGetBalance());
    await renderTarget();
    screen.getByText('Remaining balance: 10 DEMO');
  });
  it('shows available funds', async () => {
    mockUseWallet(mockUseStrategy(), mockDeposit(), mockGetBalance());

    await renderTarget();
    await waitFor(() => expect(screen.getByText('88.12')).toBeInTheDocument());
  });
  describe('when available funds is clicked', () => {
    it('fills the input with available funds', async () => {
      mockUseWallet(mockUseStrategy(), mockDeposit(), mockGetBalance());

      await renderTarget();
      await waitFor(() => expect(screen.getByText('88.12')).toBeInTheDocument());
      act(() => {
        fireEvent.click(screen.getByText('88.12'));
      });
      expect(screen.getByTestId('top-up-input').getAttribute('value')).toBe('88.12');
    });
  });
  describe('when valid top up amount is submitted', () => {
    it('should successfully top up', async () => {
      const execute = jest.fn();
      mockUseWallet(mockUseStrategy(), mockDeposit(execute), mockGetBalance());

      await renderTarget();
      act(() => {
        fireEvent.change(screen.getByTestId('top-up-input'), { target: { value: '1' } });
        fireEvent.click(screen.getByTestId('submit-button'));
      });
      await waitFor(() => expect(execute).toHaveBeenCalled());
      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith({
          pathname: '/strategies/top-up/success',
          query: { strategyId: '1', timeSaved: 10 },
        }),
      );
    });
  });
  describe('when submit fails', () => {
    it('should show form error message', async () => {
      const execute = jest.fn();
      mockUseWallet(mockUseStrategy(), mockDeposit(execute, false), mockGetBalance());

      await renderTarget();
      const input = await waitFor(() => screen.getByTestId('top-up-input'));
      const button = await waitFor(() => screen.getByTestId('submit-button'));
      await act(async () => {
        await fireEvent.change(input, { target: { value: '1' } });
        await fireEvent.click(button);
      });
      await waitFor(() => expect(execute).toHaveBeenCalled());
      await waitFor(() => screen.getByText('Failed to top up strategy (Reason: test error)'));
    });
  });

  describe('when invalid top up amount is submitted', () => {
    const execute = jest.fn();
    it('should show validation message', async () => {
      mockUseWallet(mockUseStrategy(), mockDeposit(execute), mockGetBalance());

      await renderTarget();
      const input = await waitFor(() => screen.getByTestId('top-up-input'));
      const button = await waitFor(() => screen.getByTestId('submit-button'));
      await act(async () => {
        await fireEvent.change(input, { target: { value: '100' } });
        await fireEvent.click(button);
      });
      await waitFor(() => expect(execute).not.toHaveBeenCalled());
      await waitFor(() => screen.getByText('Top up amount must be less than or equal to 88.12'));
    });
  });
});
