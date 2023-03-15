import { render, screen, waitFor, within, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { mockGetBalance } from '@helpers/test/mockGetBalance';

import { kujiraQueryClient } from 'kujira.js';
import { NetworkContext } from '@components/NetworkContext';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { mockBalances } from '@helpers/test/mockBalances';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-in-puff-puff/assets',
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
  state: {},
  actions: {
    updateAction: jest.fn(),
    resetAction: jest.fn(),
  },
};

const mockKujiraQuery = {
  bank: {
    allBalances: mockBalances(),
  },
};

jest.mock('kujira.js');

jest.mock('little-state-machine', () => ({
  useStateMachine() {
    return mockStateMachine;
  },
  createStore: jest.fn(),
}));

async function renderTarget() {
  await act(() => {
    render(
      <NetworkContext>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Page />
          </QueryClientProvider>
        </ThemeProvider>
      </NetworkContext>,
    );
  });
}

describe('DCA In Assets page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (kujiraQueryClient as jest.Mock).mockImplementation(() => mockKujiraQuery);
    mockFiatPrice();
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      expect(
        within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
      ).toBeInTheDocument();
    });
  });

  describe('when initial denom is selected', () => {
    describe('and there are available funds', () => {
      it('should show available funds', async () => {
        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

        await renderTarget();

        const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
        selectEvent.select(select, ['DEMO']);

        await waitFor(() => expect(screen.getByText('88')).toBeInTheDocument());
      });
    });
  });
  describe('when initial denom is selected', () => {
    describe('and there are not available funds', () => {
      it('should show an amount of none', async () => {
        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

        await renderTarget();

        const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
        await selectEvent.select(select, ['USK']);

        await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
      });
    });
  });

  describe('when initial deposit is entered', () => {
    describe('and the amount is greater than the available funds', () => {
      it('should show an error', async () => {
        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

        await renderTarget();

        const initalDenomSelect = await waitFor(() =>
          screen.getByLabelText(/How will you fund your first investment?/),
        );
        await selectEvent.select(initalDenomSelect, ['DEMO']);

        await waitFor(() => expect(screen.getByText('88')).toBeInTheDocument());
        const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

        // enter initial deposit
        await act(async () => {
          await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
        });

        // select resulting denom
        const select = await waitFor(() => screen.getByLabelText(/What asset do you want to invest in?/));
        await selectEvent.select(select, ['KUJI']);

        // submit
        await act(async () => {
          await waitFor(() => userEvent.click(screen.getByText(/Next/)));
        });

        await waitFor(() =>
          expect(
            screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
          ).toBeInTheDocument(),
        );

        expect(screen.getByText('Next')).toBeDisabled();
      });
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      // wait for balances to load
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 1000));

      // select initial denom
      await waitFor(() => screen.getByText(/How will you fund your first investment?/));
      await selectEvent.select(screen.getByLabelText(/How will you fund your first investment?/), ['USK']);

      // enter initial deposit
      const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
      await waitFor(() => userEvent.type(input, '5'), { timeout: 5000 });

      // select resulting denom
      await selectEvent.select(screen.getByLabelText(/What asset do you want to invest in?/), ['NBTC']);

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)));

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
        initialDeposit: 5,
        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-in-puff-puff/customise',
        query: undefined,
      });
    });
  });
});
