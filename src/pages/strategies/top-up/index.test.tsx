import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useCWClient, useExecuteContract, useWallet } from '@wizard-ui/react';
import { Strategy } from '@hooks/useStrategies';
import mockStrategyData from 'src/fixtures/strategy';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockPriceTrigger, mockTimeTrigger } from 'src/fixtures/trigger';
import { UseStrategyResponse } from '@hooks/useStrategy';
import { act } from 'react-dom/test-utils';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/strategies/top-up',
  query: { id: '1' },
};

const mockToast = jest.fn();

jest.mock('@wizard-ui/react');
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

function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

function mockUseStrategy(data: Partial<UseStrategyResponse> = {}) {
  (useCWClient as jest.Mock).mockImplementation(() => {
    const queryContractSmart = jest.fn();
    when(queryContractSmart)
      .calledWith(CONTRACT_ADDRESS, {
        get_vault: {
          vault_id: '1',
          address: 'kujitestwallet',
        },
      })
      .mockResolvedValue({ vault: mockStrategy(), trigger: mockTimeTrigger, ...data });

    const getBalance = jest.fn();
    when(getBalance)
      .calledWith('kujitestwallet', 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo')
      .mockResolvedValue({ amount: (88.12 * 1000000).toString() });

    return {
      queryContractSmart,
      getBalance,
    };
  });
}

const execute = jest.fn();

function mockWallet() {
  (useWallet as jest.Mock).mockImplementation(() => {
    when(execute)
      .calledWith(
        'kujitestwallet',
        CONTRACT_ADDRESS,
        {
          deposit: {
            vault_id: '1',
            address: 'kujitestwallet',
          },
        },
        'auto',
        undefined,
        [{ amount: '1000000', denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo' }],
      )
      .mockResolvedValue('');

    return {
      address: 'kujitestwallet',
      connected: true,
      client: {
        execute,
      },
    };
  });
}

function renderTarget() {
  render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>,
  );
}

describe('Top up page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the heading', async () => {
    mockWallet();

    mockUseStrategy();

    renderTarget();
    expect(within(screen.getByTestId('strategy-modal-header')).getByText('Top Up Strategy')).toBeInTheDocument();
  });
  it('renders remaining balance', async () => {
    mockWallet();

    mockUseStrategy();

    renderTarget();
    screen.getByText('Remaining balance: 10 DEMO');
  });
  it('shows available funds', async () => {
    mockWallet();

    mockUseStrategy();

    renderTarget();
    await waitFor(() => expect(screen.getByText('88.12')).toBeInTheDocument());
  });
  describe('when available funds is clicked', () => {
    it('fills the input with available funds', async () => {
      mockWallet();

      mockUseStrategy();

      renderTarget();
      await waitFor(() => expect(screen.getByText('88.12')).toBeInTheDocument());
      act(() => {
        fireEvent.click(screen.getByText('88.12'));
      });
      expect(screen.getByTestId('top-up-input').getAttribute('value')).toBe('88.12');
    });
  });
  describe('when valid top up amount is submitted', () => {
    it('should successfully top up', async () => {
      mockWallet();

      mockUseStrategy();

      renderTarget();
      act(() => {
        fireEvent.change(screen.getByTestId('top-up-input'), { target: { value: '1' } });
        fireEvent.click(screen.getByTestId('submit-button'));
      });
      await waitFor(() => expect(execute).toHaveBeenCalled());
      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith({
          pathname: '/strategies/top-up/success',
          query: { strategyId: '1' },
        }),
      );
    });
    describe('when submit fails', () => {
      it('should show form error message', async () => {
        (useWallet as jest.Mock).mockImplementation(() => {
          when(execute)
            .calledWith(
              'kujitestwallet',
              CONTRACT_ADDRESS,
              {
                deposit: {
                  vault_id: '1',
                  address: 'kujitestwallet',
                },
              },
              'auto',
              undefined,
              [{ amount: '1000000', denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo' }],
            )
            .mockRejectedValue(new Error('test error'));

          return {
            address: 'kujitestwallet',
            connected: true,
            client: {
              execute,
            },
          };
        });

        mockUseStrategy();

        renderTarget();
        act(() => {
          fireEvent.change(screen.getByTestId('top-up-input'), { target: { value: '1' } });
          fireEvent.click(screen.getByTestId('submit-button'));
        });
        await waitFor(() => expect(execute).toHaveBeenCalled());
        await waitFor(() => screen.getByText('Failed to top up strategy (Reason: test error)'));
      });
    });
  });

  describe('when invalid top up amount is submitted', () => {
    it('should show validation message', async () => {
      mockUseStrategy();

      renderTarget();
      act(() => {
        fireEvent.change(screen.getByTestId('top-up-input'), { target: { value: '100' } });
        fireEvent.click(screen.getByTestId('submit-button'));
      });
      await waitFor(() => expect(execute).not.toHaveBeenCalled());
      await waitFor(() => screen.getByText('Top up amount must be less than or equal to 88.12'));
    });
  });
});
