import { fireEvent, render, screen, waitFor, within, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockUseStrategy } from '@helpers/test/mockGetVault';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import userEvent from '@testing-library/user-event';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/strategies/configure',
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

function mockUpdate(execute = jest.fn(), success = true) {
  const msg = {
    update: {
      vault_id: '1',
      destinations: [],
      address: 'kujiratestwallet',
    },
  };
  if (success) {
    when(execute)
      .expectCalledWith('kujiratestwallet', CONTRACT_ADDRESS, msg, 'auto', undefined, [
        { amount: '1000000', denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo' },
      ])
      .mockResolvedValueOnce('');
  } else {
    when(execute)
      .expectCalledWith('kujiratestwallet', CONTRACT_ADDRESS, msg, 'auto', undefined, [
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

describe('Configure page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the heading', async () => {
    mockUseWallet(mockUseStrategy(), mockUpdate(), mockGetBalance());

    await renderTarget();

    expect(within(screen.getByTestId('strategy-modal-header')).getByText('Configure Strategy')).toBeInTheDocument();
  });
  describe('when submitted', () => {
    it('should successfully update', async () => {
      const execute = jest.fn();
      mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockUpdate(execute));

      await renderTarget();

      await waitFor(() => userEvent.click(screen.getAllByText(/No/)[0]), { timeout: 10000 });

      await waitFor(
        () => userEvent.type(screen.getByLabelText(/Choose Account/), 'kujira000000000000000000000000000000000000000'),
        { timeout: 10000 },
      );
      act(() => {
        fireEvent.click(screen.getByTestId('submit-button'));
      });
      await waitFor(() => expect(execute).toHaveBeenCalled());
      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith({
          pathname: '/strategies/configure/success',
          query: { strategyId: '1' },
        }),
      );
    });
  });
});
