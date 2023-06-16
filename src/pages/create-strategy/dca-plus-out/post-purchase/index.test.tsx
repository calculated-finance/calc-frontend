import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { mockValidators } from '@helpers/test/mockValidators';
import { useFormStore } from '@hooks/useFormStore';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-out/post-purchase',
  query: { id: '1' , chain: 'Kujira'},
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
    dcaPlusOut: {
      initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
      initialDeposit: '10',
      resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
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

describe('DCA Out post-purchase page', () => {
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
      mockValidators();

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
        autoStakeValidator: null,
        sendToWallet: 'no',
        postPurchaseOption: 'sendToWallet',
        recipientAccount: 'kujira000000000000000000000000000000000000000',
        yieldOption: null,
        reinvestStrategy: null,
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-out/confirm-purchase',
        query: { chain: 'Kujira'},
      });
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockValidators();

      mockUseWallet(jest.fn(), jest.fn(), jest.fn());

      await renderTarget();

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)));

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        autoStakeValidator: null,
        recipientAccount: '',
        postPurchaseOption: 'sendToWallet',
        sendToWallet: 'yes',
        yieldOption: null,
        reinvestStrategy: null,
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/dca-plus-out/confirm-purchase',
        query: { chain: 'Kujira'},
      });
    });
  });
});
