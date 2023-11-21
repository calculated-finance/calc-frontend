import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockCreateVault } from '@helpers/test/mockCreateVault';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { encode } from '@helpers/encode';
import { useFormStore } from '@hooks/useFormStore';
import { CONTRACT_ADDRESS, SECONDS_IN_A_DAY } from 'src/constants';
import { ChainId } from '@hooks/useChainId/Chains';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-in/confirm-purchase',
  query: { id: '1', chain: 'Kujira' },
  events: {
    on: jest.fn(),
  },
};

jest.mock('@hooks/useWallet');

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

const mockStateMachine = {
  state: {
    dcaPlusIn: {
      initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
      initialDeposit: '30',
      resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
      advancedSettings: false,
      autoStakeValidator: null,
      autoCompoundStakingRewards: true,
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

    useFormStore.setState({
      forms: mockStateMachine.state,
      updateForm: () => mockStateMachine.actions.updateAction,
      resetForm: () => mockStateMachine.actions.resetAction,
    });

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

      const yourDeposit = await waitFor(() => screen.getByTestId('summary-your-deposit'));

      within(yourDeposit).getByText('30 USK');

      const theSwap = screen.getByTestId('summary-the-swap-dca-plus');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('NBTC');
      within(theSwap).getByText('0.644 USK');
      within(theSwap).getByText('1.474 USK');

      const benchmark = screen.getByTestId('summary-benchmark');

      within(benchmark).getByText('1 USK');
      within(benchmark).getByText('30 days');
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      const executeMsg = {
        create_vault: {
          label: '',
          time_interval: { custom: { seconds: SECONDS_IN_A_DAY } },
          target_denom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
          swap_amount: '1000000',
          slippage_tolerance: '0.02',
          swap_adjustment_strategy: { risk_weighted_average: { base_denom: 'bitcoin' } },
          performance_assessment_strategy: 'compare_to_standard_dca',
        },
      };

      const mockCreateStrategy = mockCreateVault([
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: {
            contract: CONTRACT_ADDRESS,
            funds: [
              {
                amount: '30000000',
                denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
              },
            ],
            msg: encode(executeMsg),
            sender: 'kujiratestwallet',
          },
        },
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            amount: [
              {
                amount: '28571',
                denom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
              },
            ],
            fromAddress: 'kujiratestwallet',
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
        pathname: '/create-strategy/dca-plus-in/success',
        query: {
          strategyId: '59',
          timeSaved: 300,
          chain: 'kaiyo-1',
        },
      });
    });
  });
});
