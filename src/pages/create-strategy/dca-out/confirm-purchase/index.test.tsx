import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from 'src/helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockCreateVault } from 'src/helpers/test/mockCreateVault';
import { mockGetPairs } from 'src/helpers/test/mockGetPairs';
import YesNoValues from '@models/YesNoValues';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/confirm-purchase',
  query: { id: '1' },
  events: {
    on: jest.fn(),
  },
};

jest.mock('@wizard-ui/react');

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

const mockStateMachine = {
  state: {
    dcaOut: {
      initialDenom: 'ukuji',
      initialDeposit: '1',
      resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
      advancedSettings: false,
      executionInterval: 'daily',
      priceThresholdEnabled: YesNoValues.No,
      priceThresholdValue: null,
      purchaseTime: '',
      slippageTolerance: 2,
      startDate: null,
      startImmediately: 'yes',
      startPrice: null,
      swapAmount: 1,
      triggerType: 'date',
      autoStake: 'no',
      autoStakeValidator: null,
      recipientAccount: null,
      sendToWallet: 'yes',
    },
  },
  actions: {
    updateAction: jest.fn(),
    resetAction: jest.fn(),
  },
};

jest.mock('little-state-machine', () => ({
  useStateMachine() {
    return mockStateMachine;
  },
  createStore: jest.fn(),
}));

async function renderTarget() {
  act(() => {
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Page />
        </QueryClientProvider>
      </ThemeProvider>,
    );
  });
}

describe('DCA Out confirm page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      expect(within(screen.getByTestId('strategy-modal-header')).getByText('Confirm & Sign')).toBeInTheDocument();
    });
  });

  describe('on page load', () => {
    it('renders the summary links', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      const yourDeposit = screen.getByTestId('summary-your-deposit');

      within(yourDeposit).getByText('1 KUJI');

      const theSwap = screen.getByTestId('summary-the-swap');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('OSMO');
      within(theSwap).getByText('day');
      within(theSwap).getByText('1 day');
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      const mockCreateStrategy = mockCreateVault(
        {
          create_vault: {
            destinations: undefined,
            label: '',
            pair_address: 'kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867',
            slippage_tolerance: '0.02',
            swap_amount: '1000000',
            target_price: undefined,
            target_start_time_utc_seconds: undefined,
            time_interval: 'daily',
            price_threshold: undefined,
          },
        },
        [{ amount: '1000000', denom: 'ukuji' }],
      );
      const mockGetPairsSpy = mockGetPairs();
      mockUseWallet(mockGetPairsSpy, mockCreateStrategy, jest.fn());

      await renderTarget();

      // tick checkbox
      userEvent.click(screen.getByLabelText('I have read and agree to be bound by the CALC Terms & Conditions.'));

      // submit
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Confirm' })), { timeout: 50000 });

      // await waitFor(() => expect(mockCreateStrategy).toHaveBeenCalledWith({}));

      await waitFor(() => expect(mockStateMachine.actions.resetAction).toHaveBeenCalled());

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/success',
        query: {
          strategyId: '59',
          timeSaved: 10,
        },
      });
    });
  });
});
