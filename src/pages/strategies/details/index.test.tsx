import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import { mockPriceTrigger } from 'src/fixtures/trigger';
import { mockValidators } from 'src/helpers/test/mockValidators';
import { dcaOutStrategy } from 'src/fixtures/strategy';
import Page from './index.page';
import { mockUseWallet } from '../../../helpers/test/mockUseWallet';
import { mockStrategy, mockUseStrategy } from '../../../helpers/test/mockGetVault';

const mockRouter = {
  push: jest.fn(),
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

function mockCancelVault(success = true) {
  const execute = jest.fn();
  const msg = {
    cancel_vault: {
      address: 'kujitestwallet',
      vault_id: '1',
    },
  };
  if (success) {
    when(execute).calledWith('kujitestwallet', CONTRACT_ADDRESS, msg, 'auto').mockResolvedValueOnce({});
  } else {
    when(execute)
      .calledWith('kujitestwallet', CONTRACT_ADDRESS, msg, 'auto')
      .mockRejectedValueOnce(new Error('test reason'));
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

describe('Detail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidators();
  });
  it('renders the heading', async () => {
    mockUseWallet(mockUseStrategy(), mockCancelVault());
    await renderTarget();
    await waitFor(() => expect(screen.getByTestId('details-heading').textContent).toBe('DEMO to KUJI - Weekly'));
  });
  describe('next swap', () => {
    describe('when strategy is completed', () => {
      it('does not render next swap', async () => {
        mockUseWallet(mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) }), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.queryAllByTestId('next-swap-info')).toEqual([]));
      });
    });
    describe('when strategy is not completed', () => {
      describe('when time trigger is set', () => {
        it('renders next swap', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('May 22, 2022 at 5:00 PM'));
        });
      });
      describe('when price trigger is set', () => {
        it('renders next swap', async () => {
          mockUseWallet(mockUseStrategy({ trigger: mockPriceTrigger }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('When 1 KUJI ≤ 0.5 DEMO'));
        });
      });
    });
  });
  describe('strategy details', () => {
    describe('strategy status', () => {
      describe('when active', () => {
        it('renders active', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('active'));
        });
      });
      describe('when scheduled', () => {
        it('renders scheduled', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy({ status: 'scheduled' }) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('scheduled'));
        });
      });
      describe('when completed', () => {
        it('renders completed', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('completed'));
        });
      });
    });
    describe('strategy name', () => {
      describe('when dca in', () => {
        it('renders name', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-name').textContent).toBe('DEMO to KUJI - Weekly'));
        });
      });
    });
    describe('strategy type', () => {
      describe('when DCA In', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA In'));
        });
      });
      describe('when DCA Out', () => {
        it('renders type', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy(dcaOutStrategy) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA Out'));
        });
      });
    });
    describe('strategy start date', () => {
      describe('when scheduled', () => {
        it('renders start date', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy({ started_at: undefined }) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('-'));
        });
      });
      describe('when active', () => {
        it('renders start date', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('May 21, 2022'));
        });
      });
    });
    describe('strategy end date', () => {
      describe('when scheduled', () => {
        it('renders end date', async () => {
          mockUseWallet(mockUseStrategy({ vault: mockStrategy({ started_at: undefined }) }), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('estimated-strategy-end-date').textContent).toMatch(/^[A-Z][a-z]+\s[0-9]+,\s[0-9]+$/)); // regex for Mmm dd, yyyy
        });
      });
      describe('when active', () => {
        it('renders end date', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('estimated-strategy-end-date').textContent).toMatch(/^[A-Z][a-z]+\s[0-9]+,\s[0-9]+$/)); // regex for Mmm dd, yyyy
        });
      });
    });
    describe('investment cycle', () => {
      it('renders cycle', async () => {
        mockUseWallet(mockUseStrategy(), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-investment-cycle').textContent).toBe('weekly'));
      });
    });
    describe('strategy swap amount', () => {
      it('renders swap amount', async () => {
        mockUseWallet(mockUseStrategy(), mockCancelVault());

        await renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-swap-amount').textContent).toBe('1 DEMO'));
      });
    });
    describe('current amount in wallet', () => {
      it('renders amount', async () => {
        mockUseWallet(mockUseStrategy(), mockCancelVault());

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
                destinations: [{ address: 'kujiravalopertestvalidator', allocation: '1', action: 'send' }],
              }),
            }),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-auto-staking-status').textContent).toBe('Active'));
        });
        it('renders name', async () => {
          mockUseWallet(
            mockUseStrategy({
              vault: mockStrategy({
                destinations: [{ address: 'kujiravalopertestvalidator', allocation: '1', action: 'send' }],
              }),
            }),
            mockCancelVault(),
          );

          await renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-validator-name').textContent).toBe('test'));
        });
      });
      describe('when auto staker is not set', () => {
        it('does not render status', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());
          await renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-auto-staking-status')).toBeNull());
        });
      });
    });
    describe('receiving address', () => {
      describe('when receiving address is the same as current address', () => {
        it('does not render address', async () => {
          mockUseWallet(mockUseStrategy(), mockCancelVault());

          await renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-receiving-address')).toBeNull());
        });
      });
      describe('when receiving address is different from current address', () => {
        it('renders address', async () => {
          mockUseWallet(
            mockUseStrategy({
              vault: mockStrategy({
                destinations: [{ address: 'kujiraotheraddress', allocation: '1', action: 'send' }],
              }),
            }),
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

  describe('cancel button', () => {
    describe('when cancel button is clicked', () => {
      it('opens cancel modal', async () => {
        mockUseWallet(mockUseStrategy(), mockCancelVault());

        await renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
      });
    });
    describe('when cancel modal is closed', () => {
      it('closes cancel modal', async () => {
        mockUseWallet(mockUseStrategy(), mockCancelVault());

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
        mockUseWallet(mockUseStrategy(), mockCancelVault());

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
            duration: 9000,
            isClosable: true,
            position: 'top-right',
            status: 'success',
            title: 'Strategy cancelled.',
          }),
        );
      });
    });
  });
  describe('when strategy failed to cancel', () => {
    it('closes and shows toast', async () => {
      mockUseWallet(mockUseStrategy(), mockCancelVault(false));

      await renderTarget();
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
          duration: 9000,
          isClosable: true,
          position: 'top-right',
          status: 'error',
          title: 'Something went wrong',
        }),
      );
    });
  });
});
