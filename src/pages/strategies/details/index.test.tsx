import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import { useToast } from '@chakra-ui/react';
import Page from './index.page';

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
      .mockResolvedValueOnce({ vault: mockStrategy(), trigger: mockTimeTrigger, ...data });

    return {
      queryContractSmart,
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

describe('Detail page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useWallet as jest.Mock).mockImplementation(() => {
      const execute = jest.fn();
      when(execute)
        .calledWith(
          'kujitestwallet',
          CONTRACT_ADDRESS,
          {
            cancel_vault: {
              address: 'kujitestwallet',
              vault_id: '1',
            },
          },
          'auto',
        )
        .mockResolvedValueOnce('');
      return {
        address: 'kujitestwallet',
        connected: true,
        client: {
          execute,
        },
      };
    });

    (useExecuteContract as jest.Mock).mockImplementation(() => {
      const mutate = jest.fn();
      when(mutate)
        .calledWith(
          {
            msg: {
              cancel_vault: {
                address: 'kujitestwallet',
                vault_id: '1',
              },
            },
          },
          expect.anything(),
        )
        .mockResolvedValueOnce('');
      return {
        mutate: jest.fn().mockResolvedValue(''),
      };
    });
  });
  it('renders the heading', async () => {
    mockUseStrategy();

    renderTarget();
    await waitFor(() => expect(screen.getByTestId('details-heading').textContent).toBe('DCA In 1'));
  });
  describe('next swap', () => {
    describe('when strategy is completed', () => {
      it('does not render next swap', async () => {
        mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) });

        renderTarget();
        await waitFor(() => expect(screen.queryAllByTestId('next-swap-info')).toEqual([]));
      });
    });
    describe('when strategy is not completed', () => {
      describe('when time trigger is set', () => {
        it('renders next swap', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('May 22, 2022 at 5:00 PM'));
        });
      });
      describe('when price trigger is set', () => {
        it('renders next swap', async () => {
          mockUseStrategy({ trigger: mockPriceTrigger });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('When 1 KUJI ≤ 0.5 DEMO'));
        });
      });
    });
  });
  describe('strategy details', () => {
    describe('strategy status', () => {
      describe('when active', () => {
        it('renders active', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('active'));
        });
      });
      describe('when scheduled', () => {
        it('renders scheduled', async () => {
          mockUseStrategy({ vault: mockStrategy({ status: 'scheduled' }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('scheduled'));
        });
      });
      describe('when completed', () => {
        it('renders completed', async () => {
          mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-status').textContent).toBe('completed'));
        });
      });
    });
    describe('strategy name', () => {
      describe('when dca in', () => {
        it('renders name', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-name').textContent).toBe('DCA In 1'));
        });
      });
      describe('when dca out', () => {
        it('renders name', async () => {
          mockUseStrategy({ vault: mockStrategy({ position_type: 'exit' }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-name').textContent).toBe('DCA Out 1'));
        });
      });
    });
    describe('strategy type', () => {
      describe('when enter', () => {
        it('renders type', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA In'));
        });
      });
      describe('when exit', () => {
        it('renders type', async () => {
          mockUseStrategy({ vault: mockStrategy({ position_type: 'exit' }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-type').textContent).toBe('DCA Out'));
        });
      });
    });
    describe('strategy start date', () => {
      describe('when scheduled', () => {
        it('renders start date', async () => {
          mockUseStrategy({ vault: mockStrategy({ started_at: undefined }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('-'));
        });
      });
      describe('when active', () => {
        it('renders start date', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-start-date').textContent).toBe('May 21, 2022'));
        });
      });
    });
    describe('strategy end date', () => {
      describe('when scheduled', () => {
        it('renders end date', async () => {
          mockUseStrategy({ vault: mockStrategy({ started_at: undefined }) });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-end-date').textContent).toBe('-'));
        });
      });
      describe('when active', () => {
        it('renders end date', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-end-date').textContent).toBe('-'));
        });
      });
    });
    describe('investment cycle', () => {
      it('renders cycle', async () => {
        mockUseStrategy();

        renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-investment-cycle').textContent).toBe('weekly'));
      });
    });
    describe('strategy swap amount', () => {
      it('renders swap amount', async () => {
        mockUseStrategy();

        renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-swap-amount').textContent).toBe('1 DEMO'));
      });
    });
    describe('current amount in wallet', () => {
      it('renders amount', async () => {
        mockUseStrategy();

        renderTarget();
        await waitFor(() => expect(screen.getByTestId('strategy-current-balance').textContent).toBe('10 DEMO'));
      });
    });
    describe('auto staking status', () => {
      describe('when auto staker is set', () => {
        it('renders status', async () => {
          mockUseStrategy({
            vault: mockStrategy({ destinations: [{ address: 'kujiravalopertestvalidator', allocation: '1' }] }),
          });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('strategy-auto-staking-status').textContent).toBe('Active'));
        });
      });
      describe('when auto staker is not set', () => {
        it('does not render status', async () => {
          mockUseStrategy();
          renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-auto-staking-status')).toBeNull());
        });
      });
    });
    describe('receiving address', () => {
      describe('when receiving address is the same as current address', () => {
        it('does not render address', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.queryByTestId('strategy-receiving-address')).toBeNull());
        });
      });
      describe('when receiving address is different from current address', () => {
        it('renders address', async () => {
          mockUseStrategy({
            vault: mockStrategy({ destinations: [{ address: 'kujiraotheraddress', allocation: '1' }] }),
          });

          renderTarget();
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
        mockUseStrategy();

        renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
      });
    });
    describe('when cancel modal is closed', () => {
      it('closes cancel modal', async () => {
        mockUseStrategy();

        renderTarget();
        await waitFor(() => {
          fireEvent.click(screen.getByTestId('cancel-strategy-button'));
        });
        await waitFor(() => expect(screen.getByTestId('cancel-strategy-modal')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('cancel-strategy-modal-close-button'));
        await waitFor(() => expect(screen.queryByTestId('cancel-strategy-modal')).toBeNull());
      });
    });
    describe('when strategy is successfully cancelled', () => {
      beforeEach(() => {
        (useWallet as jest.Mock).mockImplementation(() => {
          const execute = jest.fn();
          when(execute)
            .calledWith(
              'kujitestwallet',
              CONTRACT_ADDRESS,
              {
                cancel_vault: {
                  address: 'kujitestwallet',
                  vault_id: '1',
                },
              },
              'auto',
            )
            .mockResolvedValueOnce('');
          return {
            address: 'kujitestwallet',
            connected: true,
            client: {
              execute,
            },
          };
        });
      });
      it('cancels strategy, redirects and shows toast', async () => {
        mockUseStrategy();

        renderTarget();
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
  describe('when strategy is successfully cancelled', () => {
    beforeEach(() => {
      (useWallet as jest.Mock).mockImplementation(() => {
        const execute = jest.fn();
        when(execute)
          .calledWith(
            'kujitestwallet',
            CONTRACT_ADDRESS,
            {
              cancel_vault: {
                address: 'kujitestwallet',
                vault_id: '1',
              },
            },
            'auto',
          )
          .mockRejectedValue(new Error('test reason'));
        return {
          address: 'kujitestwallet',
          connected: true,
          client: {
            execute,
          },
        };
      });
    });
    it('closes and shows toast', async () => {
      mockUseStrategy();

      renderTarget();
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
