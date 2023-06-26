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
import YesNoValues from '@models/YesNoValues';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { useFormStore } from '@hooks/useFormStore';
import { Chains } from '@hooks/useChain/Chains';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-in/confirm-purchase',
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
    dcaIn: {
      initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
      initialDeposit: '1',
      resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
      advancedSettings: false,
      executionInterval: 'daily',
      executionIntervalIncrement: 1,
      priceThresholdEnabled: YesNoValues.No,
      priceThresholdValue: null,
      purchaseTime: '',
      slippageTolerance: 2,
      startDate: null,
      startImmediately: 'yes',
      startPrice: null,
      swapAmount: 1,
      triggerType: 'date',
      autoStakeValidator: null,
      autoCompoundStakingRewards: true,
      recipientAccount: null,
      sendToWallet: 'yes',
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

describe('DCA In confirm page', () => {
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

      within(yourDeposit).getByText('1 USK');

      const theSwap = screen.getByTestId('summary-the-swap');

      within(theSwap).getByText('Immediately');
      within(theSwap).getByText('NBTC');
      within(theSwap).getByText('1 cycle');
      within(theSwap).getByText('1 day');
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
        pathname: '/create-strategy/dca-in/success',
        query: {
          strategyId: '59',
          timeSaved: 10,
          chain: Chains.Kujira,
        },
      });
    });
  });
});
