import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import { mockBalances } from '@helpers/test/mockBalances';
import * as constants from 'src/constants';
import { KujiraQueryClient } from 'kujira.js';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
// import { useKujira } from '@hooks/useKujira';
import { useFormStore } from '@hooks/useFormStore';
import { useOsmosis } from '@hooks/useOsmosis';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/assets',
  query: { id: '1', chain: 'Kujira' },
  events: {
    on: jest.fn(),
  },
};

jest.mock('src/constants');
jest.mock('@hooks/useWallet');

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

jest.mock('kujira.js');

const mockStateMachine = {
  state: {},
  actions: {
    updateAction: jest.fn(),
    resetAction: jest.fn(),
  },
};

async function renderTarget() {
  await act(() => {
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Page />
        </QueryClientProvider>
      </ThemeProvider>,
    );
  });
}

describe('DCA Out Assets page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFiatPrice();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.featureFlags = {
      singleAssetsEnabled: false,
    };
    useFormStore.setState({
      forms: mockStateMachine.state,
      updateForm: () => mockStateMachine.actions.updateAction,
      resetForm: () => mockStateMachine.actions.resetAction,
    });

    useOsmosis.setState({
      query: jest.fn(),
    });

    // useKujira.setState({
    //   query: {
    //     bank: {
    //       allBalances: mockBalances(),
    //     },
    //   } as unknown as KujiraQueryClient,
    // });
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

        const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
        selectEvent.select(select, ['KUJI']);

        await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
      });
    });
  });

  describe('when initial denom is selected', () => {
    describe('and there are not available funds', () => {
      it('should show an amount of none', async () => {
        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

        await renderTarget();

        const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
        await selectEvent.select(select, ['NBTC']);

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
          screen.getByLabelText(/What position do you want to take profit on?/),
        );
        await selectEvent.select(initalDenomSelect, ['KUJI']);

        await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
        const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

        // enter initial deposit
        await act(async () => {
          await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
        });

        // select resulting denom
        const select = await waitFor(() => screen.getByLabelText(/How do you want to hold your profits?/));
        await selectEvent.select(select, ['OSMO']);

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
      await waitFor(() => screen.getByText(/What position do you want to take profit on?/));
      await selectEvent.select(screen.getByLabelText(/What position do you want to take profit on?/), ['KUJI']);

      // enter initial deposit
      const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
      await waitFor(() => userEvent.type(input, '1'), { timeout: 5000 });

      // select resulting denom
      await selectEvent.select(screen.getByLabelText(/How do you want to hold your profits?/), ['OSMO']);

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)));

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        initialDenom: 'ukuji',
        initialDeposit: 1,
        resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-out/customise',
        query: { chain: 'Kujira' },
      });
    });
  });

  describe('connect wallet button behaviour', () => {
    it('shows connect wallet when not connected', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

      await renderTarget();
      expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
    });

    it('does not show connect wallet when connected', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
      await renderTarget();

      expect(screen.getByText(/Next/)).toBeInTheDocument();
    });
  });
});
