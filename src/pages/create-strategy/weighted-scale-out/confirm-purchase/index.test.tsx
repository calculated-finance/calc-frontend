import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockCreateVault } from '@helpers/test/mockCreateVault';
import { encode } from '@helpers/encode';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { useFormStore } from '@hooks/useFormStore';
import TriggerTypes from '@models/TriggerTypes';
import YesNoValues from '@models/YesNoValues';
import { CONTRACT_ADDRESS } from 'src/constants';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/weighted-scale-out/confirm-purchase',
  query: { id: '1' },
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
    weightedScaleOut: {
      initialDenom: 'ukuji',
      initialDeposit: '30',
      resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
      advancedSettings: true,
      autoStakeValidator: null,
      recipientAccount: null,
      sendToWallet: 'yes',
      strategyDuration: 30,
      startImmediately: YesNoValues.Yes,
      triggerType: TriggerTypes.Date,
      priceThresholdEnabled: YesNoValues.No,
      priceThresholdValue: null,
      purchaseTime: '',
      swapMultiplier: 1,
      applyMultiplier: YesNoValues.Yes,
      swapAmount: 1,
      basePriceIsCurrentPrice: YesNoValues.No,
      basePriceValue: 1,
      slippageTolerance: 0.01,
      executionInterval: 'daily',
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

describe('DCA Plus Out confirm page', () => {
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

      within(yourDeposit).getByText('30 KUJI');

      const theSwap = screen.getByTestId('summary-the-swap-weighted-scale');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('× (1 - price delta × 1)');
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      const executeMsg = {
        create_vault: {
          label: '',
          time_interval: 'daily',
          target_denom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
          swap_amount: '1000000',
          slippage_tolerance: '0.0001',
          swap_adjustment_strategy: {
            weighted_scale: { base_receive_amount: '1000000', increase_only: false, multiplier: '1' },
          },
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
                denom: 'ukuji',
              },
            ],
            msg: encode(executeMsg),
            sender: 'kujiratestwallet',
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
        pathname: '/create-strategy/weighted-scale-out/success',
        query: {
          strategyId: '59',
          timeSaved: 300,
        },
      });
    });
  });
});
