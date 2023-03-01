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
import { mockFiatPrice } from 'src/helpers/test/mockFiatPrice';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-in-puff-puff/confirm-purchase',
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
    dcaPlusIn: {
      initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
      initialDeposit: '1',
      resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
      advancedSettings: false,
      purchaseTime: '',
      startDate: null,
      startImmediately: 'yes',
      startPrice: null,
      triggerType: 'date',
      autoStake: 'no',
      autoStakeValidator: null,
      recipientAccount: null,
      sendToWallet: 'yes',
      strategyDuration: 60,
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

describe('DCA Plus In confirm page', () => {
  beforeEach(() => {
    mockFiatPrice();

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

      within(yourDeposit).getByText('1 USK');

      const theSwap = screen.getByTestId('summary-the-swap-dca-plus');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('NBTC');
      within(theSwap).getByText('0.1 USK');
      within(theSwap).getByText('1000 USK');

      const benchmark = screen.getByTestId('summary-benchmark');

      within(benchmark).getByText('20 USK');
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      const mockCreateStrategy = mockCreateVault();
      const mockGetPairsSpy = mockGetPairs();
      mockUseWallet(mockGetPairsSpy, jest.fn(), jest.fn(), mockCreateStrategy);

      await renderTarget();

      // tick checkbox
      userEvent.click(screen.getByTestId('agreement-checkbox'));

      // wait for fiat price to load
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 1000));

      // submit
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Confirm' })), { timeout: 5000 });

      await waitFor(() => expect(mockStateMachine.actions.resetAction).toHaveBeenCalled());

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-in-puff-puff/success',
        query: {
          strategyId: '59',
        },
      });
    });
  });
});
