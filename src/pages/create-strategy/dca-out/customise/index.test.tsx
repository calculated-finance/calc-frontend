import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import timekeeper from 'timekeeper';
import { ChangeEvent } from 'react';
import { SingleDatepickerProps } from 'chakra-dayzed-datepicker';
import YesNoValues from '@models/YesNoValues';
import { useFormStore } from '@hooks/useFormStore';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/customise',
  query: { id: '1' },
  events: {
    on: jest.fn(),
  },
};

jest.mock('@hooks/useWallet');

jest.mock('chakra-dayzed-datepicker', () => ({
  SingleDatepicker: ({
    onDateChange,
    date,
    ...props
  }: {
    onDateChange: (value: string) => void;
  } & Omit<SingleDatepickerProps, 'onDateChange'>) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    dcaOut: {
      initialDenom: 'ukuji',
      initialDeposit: 1,
      resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
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

describe('DCA Out customise page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useFormStore.setState({
      forms: mockStateMachine.state,
      updateForm: () => mockStateMachine.actions.updateAction,
      resetForm: () => mockStateMachine.actions.resetAction,
    });
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

      await waitFor(() => userEvent.click(screen.getAllByLabelText('No')[0]), { timeout: 5000 });
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
        executionIntervalIncrement: 1,
        purchaseTime: '',
        slippageTolerance: 2,
        startDate: null,
        startImmediately: 'no',
        startPrice: 10,
        swapAmount: 1,
        triggerType: 'price',
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: null,
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/post-purchase',
        query: undefined,
      });
    });
  });

  describe('when strategy price threshold is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      // enable advanced settings
      const advancedSettings = await waitFor(() => screen.getByRole('checkbox'));
      await waitFor(() => userEvent.click(advancedSettings), { timeout: 5000 });

      // enter swap amount
      const swapAmountInput = await waitFor(() => screen.getByLabelText(/How much KUJI each swap?/));
      await waitFor(() => userEvent.type(swapAmountInput, '1'), { timeout: 5000 });

      // enable price threshold
      await waitFor(() => userEvent.click(screen.getAllByLabelText('No')[1]), { timeout: 5000 });

      // set price threshold
      const input = await waitFor(() => screen.getByLabelText(/Set sell price floor?/));
      await waitFor(() => userEvent.type(input, '10.00'), { timeout: 5000 });

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: true,
        executionInterval: 'daily',
        executionIntervalIncrement: 1,
        startPrice: null,
        swapAmount: 1,
        triggerType: 'date',
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: 10,
        purchaseTime: '',
        slippageTolerance: 2,
        startDate: null,
        startImmediately: 'yes',
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
      await waitFor(() => userEvent.click(screen.getAllByLabelText('No')[0]), { timeout: 5000 });

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
      const slippageToleranceInput = await waitFor(() => screen.getByLabelText(/Set slippage tolerance/));
      await waitFor(() => fireEvent.change(slippageToleranceInput, { target: { value: '5' } }), { timeout: 5000 });

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: true,
        executionInterval: 'daily',
        executionIntervalIncrement: 1,
        purchaseTime: '14:55',
        slippageTolerance: 5,
        startDate: '2022-11-03T00:00:00.000Z',
        startImmediately: 'no',
        startPrice: null,
        swapAmount: 1,
        triggerType: 'date',
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: null,
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
        executionIntervalIncrement: 1,
        purchaseTime: '',
        slippageTolerance: 2,
        startDate: null,
        startImmediately: 'yes',
        startPrice: null,
        swapAmount: 1,
        triggerType: 'date',
        priceThresholdEnabled: YesNoValues.No,
        priceThresholdValue: null,
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/post-purchase',
        query: undefined,
      });
    });
  });
});
