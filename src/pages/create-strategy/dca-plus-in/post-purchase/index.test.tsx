import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockValidators } from '@helpers/test/mockValidators';
import selectEvent from 'react-select-event';
import { KujiraQueryClient } from 'kujira.js';
import { useKujira } from '@hooks/useKujira';
import { useFormStore } from '@hooks/useFormStore';
import { useOsmosis } from '@hooks/useOsmosis';
import Page from './index.page';

const mockKujiraQuery = {
  staking: {
    validators: mockValidators(),
  },
};

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-in/post-purchase',
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
    dcaPlusIn: {
      initialDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
      initialDeposit: '30',
      resultingDenom: 'ukuji',
    },
  },
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
      { container: document.body },
    );
  });
}

describe('DCA In post-purchase page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useFormStore.setState({
      forms: mockStateMachine.state,
      updateForm: () => mockStateMachine.actions.updateAction,
      resetForm: () => mockStateMachine.actions.resetAction,
    });

    useKujira.setState({
      query: mockKujiraQuery as unknown as KujiraQueryClient,
    });

    useOsmosis.setState({
      query: jest.fn(),
    });
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      expect(within(screen.getByTestId('strategy-modal-header')).getByText('Post Purchase')).toBeInTheDocument();
    });
  });

  describe('when user wanted to send to another address', () => {
    it('submits form successfully', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      await waitFor(() => userEvent.click(screen.getAllByText(/No/)[0]), { timeout: 10000 });

      await waitFor(
        () => userEvent.type(screen.getByLabelText(/Choose Account/), 'kujira000000000000000000000000000000000000000'),
        { timeout: 10000 },
      );

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 10000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        autoStake: 'no',
        autoStakeValidator: null,
        postPurchaseOption: 'sendToWallet',
        sendToWallet: 'no',
        recipientAccount: 'kujira000000000000000000000000000000000000000',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-in/confirm-purchase',
        query: undefined,
      });
    });
  });
  describe('when user wanted to autostake', () => {
    it('submits form successfully', async () => {
      process.env.PORTAL_SELECT_DISABLED = 'true';
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      await waitFor(() => userEvent.click(screen.getAllByText(/Stake/)[0]), { timeout: 10000 });
      await waitFor(() => userEvent.click(screen.getAllByText(/Yes/)[1]), { timeout: 16000 });

      const select = await waitFor(() => screen.getByLabelText('Choose Validator'), { timeout: 10000 });
      selectEvent.select(select, ['test']);

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 100));

      await act(async () => {
        await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 10000 });
      });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        autoStake: 'yes',
        autoStakeValidator: 'kujiravalopertestvalidator',
        postPurchaseOption: 'stake',
        recipientAccount: null,
        sendToWallet: 'yes',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-in/confirm-purchase',
        query: undefined,
      });
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 10000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        autoStake: 'no',
        autoStakeValidator: null,
        recipientAccount: null,
        postPurchaseOption: 'sendToWallet',
        sendToWallet: 'yes',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-in/confirm-purchase',
        query: undefined,
      });
    });
  });
});
