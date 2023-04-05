import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockValidators } from '@helpers/test/mockValidators';
import { dcaOutStrategy } from 'src/fixtures/strategy';
import { mockPriceTrigger } from 'src/fixtures/trigger';
import { KujiraQueryClient } from 'kujira.js';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { mockFiatPriceHistory } from '@helpers/test/mockFiatPriceHistory';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockStrategy, mockUseStrategy } from '@helpers/test/mockGetVault';
import { mockCancelVault } from '@helpers/test/mockCancelVault';
import { useKujira } from '@hooks/useKujira';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  query: { id: '1' },
};

const mockKujiraQuery = {
  staking: {
    validators: mockValidators(),
  },
  bank: {
    msgSend: jest.fn().mockImplementation(() => 'hi'),
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

async function renderTarget() {
  act(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );
  });
}

describe('Detail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useKujira.setState({
      query: mockKujiraQuery as unknown as KujiraQueryClient,
    });
    mockFiatPrice();
    mockFiatPriceHistory('usd-coin');
  });
  it('renders the heading', async () => {
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());
    await renderTarget();
    await waitFor(() => expect(screen.getByTestId('details-heading').textContent).toBe('DEMO to KUJI - Weekly'));
  });
  describe('next swap', () => {
    describe('when strategy is completed', () => {
      it('does not render next swap', async () => {
        mockUseWallet(
          mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) }),
          jest.fn(),
          jest.fn(),
          mockCancelVault(),
        );

        await renderTarget();
        await waitFor(() => expect(screen.queryAllByTestId('next-swap-info')).toEqual([]));
      });
    });
    describe('when strategy is not completed', () => {
      describe('when time trigger is set', () => {
        it('renders next swap', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() =>
            expect(screen.getByTestId('next-swap-info')).toHaveTextContent('May 22, 2022 at 5:00 PM'),
          );
        });
      });
      describe('when price trigger is set', () => {
        it('renders next swap', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ trigger: mockPriceTrigger }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() =>
            expect(screen.getByTestId('next-swap-info').textContent).toBe('When price hits 1 KUJI ≤ 0.5 DEMO'),
          );
        });
      });
    });
  });
  describe('strategy details', () => {
    describe('strategy status', () => {
      describe('when active', () => {
        it('renders active', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('active'));
        });
      });
      describe('when scheduled', () => {
        it('renders scheduled', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ status: 'scheduled' }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('scheduled'));
        });
      });
      describe('when completed', () => {
        it('renders completed', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('completed'));
        });
      });
    });
    describe('strategy name', () => {
      describe('when dca in', () => {
        it('renders name', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-name').textContent).toBe('DEMO to KUJI - Weekly'));
        });
      });
    });
    describe('strategy type', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA In'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA Out'));
        });
      });
    });
    describe('strategy start date', () => {
      describe('when scheduled', () => {
        it('renders start date', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ started_at: undefined, status: 'scheduled' }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('May 22, 2022'));
        });
      });
      describe('when price trigger', () => {
        it('renders start date', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ started_at: undefined, trigger: mockPriceTrigger }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() =>
            expect(screen.getByTestId('strategy-start-date').textContent).toBe('When KUJI hits 0.5 DEMO'),
          );
        });
      });
      describe('when active', () => {
        it('renders start date', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('May 21, 2022'));
        });
      });
    });
    describe('strategy end date', () => {
      describe('when scheduled', () => {
        it('renders end date', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy({ started_at: undefined }) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('estimated-strategy-end-date').textContent).toBe('-'));
        });
      });
      describe('when active', () => {
        it('renders end date', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('estimated-strategy-end-date').textContent).toBe('-'));
        });
      });
    });
    describe('investment cycle', () => {
      it('renders cycle', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-investment-cycle').textContent).toBe('Weekly'));
      });
    });
    describe('slippage tolerance', () => {
      it('renders slippage tolerance', async () => {
        mockUseWallet(mockUseStrategy({ vault: mockStrategy({ slippage_tolerance: '0.02' }) }), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-slippage-tolerance').textContent).toBe('2.00%'));
      });
      describe('when slippage tolerance is null', () => {
        it('does not render slippage tolerance', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy({ slippage_tolerance: null }) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-slippage-tolerance')).toBeNull());
        });
      });
    });
    describe('price ceiling', () => {
      it('renders ceiling', async () => {
        mockUseWallet(mockUseStrategy({ vault: mockStrategy({ minimum_receive_amount: '3000' }) }), mockCancelVault());

        await renderTarget();
        await waitFor(() =>
          expect(screen.getByTestId('strategy-minimum-receive-amount').textContent).toBe('333.333 DEMO'),
        );
      });
    });
    describe('strategy swap amount', () => {
      it('renders swap amount', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-swap-amount').textContent).toBe('1 DEMO - fees*'));
      });
    });
    describe('current amount in wallet', () => {
      it('renders amount', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-current-balance').textContent).toBe('10 DEMO'));
      });
    });
    describe('auto staking status', () => {
      describe('when auto staker is set', () => {
        it('renders status', async () => {
          mockUseWallet(
            mockUseStrategy({
              vault: mockStrategy({
                destinations: [{ address: 'kujiravalopertestvalidator', allocation: '1', action: 'z_delegate' }],
              }),
            }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-auto-staking-status').textContent).toBe('Active'));
        });
        it('renders name', async () => {
          mockUseWallet(
            mockUseStrategy({
              vault: mockStrategy({
                destinations: [{ address: 'kujiravalopertestvalidator', allocation: '1', action: 'z_delegate' }],
              }),
            }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-validator-name').textContent).toBe('test'));
        });
      });
      describe('when auto staker is not set', () => {
        it('does not render status', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());
          await renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-auto-staking-status')).toBeNull());
        });
      });
    });
    describe('receiving address', () => {
      describe('when receiving address is the same as current address', () => {
        it('does not render address', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-receiving-address')).toBeNull());
        });
      });
      describe('when receiving address is different from current address', () => {
        it('renders address', async () => {
          mockUseWallet(
            mockUseStrategy({
              vault: mockStrategy({
                destinations: [{ address: 'kujiraotheraddress', allocation: '1', action: 'z_delegate' }],
              }),
            }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() =>
            expect(screen.getByTestId('strategy-receiving-address').textContent).toBe('kujiraotheraddress'),
          );
        });
      });
    });
  });

  describe('strategy performance', () => {
    describe('total acculumated', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-total-acculumated').textContent).toBe('1 KUJI'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-total-acculumated').textContent).toBe('1 KUJI'));
        });
      });
    });
    describe('net cost', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-net-cost').textContent).toBe('1 DEMO'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-net-cost').textContent).toBe('1 DEMO'));
        });
      });
    });
    describe('average token cost', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-average-token-cost').textContent).toBe('$2.52 USD'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-average-token-cost').textContent).toBe('$2.52 USD'));
        });
      });
    });
    describe('market value', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-market-value').textContent).toBe('$1.50 USD'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-market-value').textContent).toBe('$1.50 USD'));
        });
      });
    });
    describe('profit', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-profit').textContent).toBe('-$0.99 USD'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(
            mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }),
            jest.fn(),
            jest.fn(),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-profit-taken').textContent).toBe('$2.50 USD'));
        });
      });
    });
  });

  describe('cancel button', () => {
    describe('when cancel button is clicked', () => {
      it('opens cancel modal', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
      });
      it('renders cancellation fee', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() =>
          expect(screen.getByTestId('cancel-strategy-model-fee').textContent).toBe('Cancellation Fee: 0.2 DEMO'),
        );
      });
    });
    describe('when cancel modal is closed', () => {
      it('closes cancel modal', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('cancel-strategy-modal-close-button'));
        await waitFor(() => expect(screen.queryByTestId('cancel-strategy-modal')).toBeNull());
      });
    });
    describe('when strategy is successfully cancelled', () => {
      it('cancels strategy, redirects and shows toast', async () => {
        mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), mockCancelVault());

        await renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('cancel-strategy-modal-cancel-button'));
        // expect to redirect to strategies page
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/strategies'));
        await waitFor(() =>
          expect(mockToast).toHaveBeenCalledWith({
            description: "We've cancelled your strategy and refunded remaining funds.",
            duration: 12000,
            isClosable: true,
            position: 'top-right',
            status: 'success',
            title: 'Strategy cancelled.',
            variant: 'subtle',
          }),
        );
      });
    });
  });
  describe('when strategy failed to cancel', () => {
    it.only('closes and shows toast', async () => {
      const cancelSpy = mockCancelVault(false);
      mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn(), cancelSpy);

      await renderTarget();

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 4000));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId('cancel-strategy-button'));
      });
      await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
      fireEvent.click(screen.getByTestId('cancel-strategy-modal-cancel-button'));
      // expect to redirect to strategies page
      await waitFor(() => expect(mockRouter.push).not.toHaveBeenCalledWith('/strategies'));
      await waitFor(() => expect(screen.queryByTestId('cancel-strategy-modal')).toBeNull());

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description: 'There was a problem cancelling your strategy (Reason: test reason)',
          duration: 12000,
          isClosable: true,
          position: 'top-right',
          status: 'error',
          title: 'Something went wrong',
          variant: 'subtle',
        }),
      );
    });
  });
});
