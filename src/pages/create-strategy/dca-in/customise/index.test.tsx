import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from 'src/helpers/test/mockUseWallet';
import { mockGetPairs } from 'src/helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-in/customise',
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
    initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
    initialDeposit: '1',
    resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
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

function renderTarget() {
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('DCA In customise page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      renderTarget();

      expect(within(screen.getByTestId('strategy-modal-header')).getByText('Customise Strategy')).toBeInTheDocument();
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      renderTarget();

      // enter swap amount
      const input = await waitFor(() => screen.getByLabelText(/How much USK each purchase?/));
      await waitFor(() => userEvent.type(input, '1'));

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)));

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
        pathname: '/create-strategy/dca-in/post-purchase',
        query: undefined,
      });
    });
  });
});
