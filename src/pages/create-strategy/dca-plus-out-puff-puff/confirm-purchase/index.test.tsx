import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockCreateVault } from '@helpers/test/mockCreateVault';
import { encode } from '@helpers/encode';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-out-puff-puff/confirm-purchase',
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
    dcaPlusOut: {
      initialDenom: 'ukuji',
      initialDeposit: '30',
      resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
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
      strategyDuration: 30,
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

describe('DCA Plus Out confirm page', () => {
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

      within(yourDeposit).getByText('30 KUJI');

      const theSwap = screen.getByTestId('summary-the-swap-dca-plus');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('OSMO');
      within(theSwap).getByText('0.662 KUJI');
      within(theSwap).getByText('1.452 KUJI');
      const benchmark = screen.getByTestId('summary-benchmark');

      within(benchmark).getByText('1 KUJI');
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      const executeMsg = {
        create_vault: {
          label: '',
          time_interval: 'daily',
          pair_address: 'kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e866',
          swap_amount: '1000000',
          target_start_time_utc_seconds: undefined,
          destinations: undefined,
          target_receive_amount: undefined,
          slippage_tolerance: '0.02',
          use_dca_plus: true,
        },
      };

      const mockCreateStrategy = mockCreateVault([
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: {
            contract: 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c',
            funds: [
              {
                amount: '30000000',
                denom: 'ukuji',
              },
            ],
            msg: encode(executeMsg),
            sender: 'kujitestwallet',
          },
        },
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            amount: [
              {
                amount: '200000',
                denom: 'ukuji',
              },
            ],
            fromAddress: 'kujitestwallet',
            toAddress: 'kujira1tn65m5uet32563jj3e2j3wxshht960znv64en0',
          },
        },
      ]);
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
        pathname: '/create-strategy/dca-plus-out-puff-puff/success',
        query: {
          strategyId: '59',
          timeSaved: 300,
        },
      });
    });
  });
});
