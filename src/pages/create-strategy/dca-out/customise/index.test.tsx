import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from 'src/helpers/test/mockUseWallet';
import { mockGetPairs } from 'src/helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import timekeeper from 'timekeeper';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/customise',
  query: { id: '1' },
  events: {
    on: jest.fn(),
  },
};

jest.mock('@wizard-ui/react');

jest.mock('chakra-dayzed-datepicker', () => ({
  SingleDatepicker: ({ onDateChange, date, ...props }: any) => {
    const handleChange = (event: any) => {
      onDateChange(event.target.value);
    };

    return (
      <input type="text" data-testid="mock-datepicker" onChange={handleChange} value={date?.toString()} {...props} />
    );
  },
}));

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

const mockStateMachine = {
  state: {
    initialDenom: 'ukuji',
    initialDeposit: 1,
    resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
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

describe('DCA Out customise page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      expect(within(screen.getByTestId('strategy-modal-header')).getByText('Customise Strategy')).toBeInTheDocument();
    });
  });

  describe('when strategy with price trigger is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      await waitFor(() => userEvent.click(screen.getByLabelText('No')), { timeout: 5000 });
      await waitFor(() => userEvent.click(screen.getByLabelText('Start based on asset price')), { timeout: 5000 });

      const input = await waitFor(() => screen.getByLabelText(/Strategy start price/));
      await waitFor(() => userEvent.type(input, '10.00'), { timeout: 5000 });

      // enter swap amount
      const swapAmountInput = await waitFor(() => screen.getByLabelText(/How much KUJI each swap?/));
      await waitFor(() => userEvent.type(swapAmountInput, '1'), { timeout: 5000 });

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: false,
        executionInterval: 'daily',
        purchaseTime: '',
        slippageTolerance: 1,
        startDate: null,
        startImmediately: 'no',
        startPrice: 10,
        swapAmount: 1,
        triggerType: 'price',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/post-purchase',
        query: undefined,
      });
    });
  });

  describe('when strategy with date trigger and advanced settings is filled and submitted', () => {
    beforeAll(() => {
      // Lock Time
      timekeeper.freeze(new Date('2022-11-02T00:00:00.000+00:00'));
    });

    afterAll(() => {
      // Unlock Time
      timekeeper.reset();
    });
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      // enable advanced settings
      const advancedSettings = await waitFor(() => screen.getByRole('checkbox'));
      await waitFor(() => userEvent.click(advancedSettings), { timeout: 5000 });

      // uncheck start immediately
      await waitFor(() => userEvent.click(screen.getByLabelText('No')), { timeout: 5000 });

      // set start date
      const dateInput = screen.getByTestId('mock-datepicker');
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
      fireEvent.change(dateInput, { target: { value: tomorrow.toISOString() } });

      // enter swap amount
      const purchaseTimeInput = await waitFor(() => screen.getByLabelText(/Sell time/));
      await waitFor(() => userEvent.type(purchaseTimeInput, '14:55'), { timeout: 5000 });

      // enter swap amount
      const swapAmountInput = await waitFor(() => screen.getByLabelText(/How much KUJI each swap?/));
      await waitFor(() => userEvent.type(swapAmountInput, '1'), { timeout: 5000 });

      // enter swap amount
      const slippageToleranceInput = await waitFor(() => screen.getByLabelText(/Set Slippage Tolerance/));
      await waitFor(() => fireEvent.change(slippageToleranceInput, { target: { value: '5' } }), { timeout: 5000 });

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: true,
        executionInterval: 'daily',
        purchaseTime: '14:55',
        slippageTolerance: 5,
        startDate: '2022-11-03T00:00:00.000Z',
        startImmediately: 'no',
        startPrice: null,
        swapAmount: 1,
        triggerType: 'date',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/post-purchase',
        query: undefined,
      });
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      // enter swap amount
      const input = await waitFor(() => screen.getByLabelText(/How much KUJI each swap?/));
      await waitFor(() => userEvent.type(input, '1'), { timeout: 5000 });

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: false,
        executionInterval: 'daily',
        purchaseTime: '',
        slippageTolerance: 1,
        startDate: null,
        startImmediately: 'yes',
        startPrice: null,
        swapAmount: 1,
        triggerType: 'date',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/post-purchase',
        query: undefined,
      });
    });
  });
});
