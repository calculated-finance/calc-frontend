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
  pathname: '/create-strategy/dca-in/assets',
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

describe('DCA In Assets page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('on page load', () => {
    it('renders the heading', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      renderTarget();

      expect(
        within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
      ).toBeInTheDocument();
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      renderTarget();

      // select initial denom
      await waitFor(() => screen.getByText(/How will you fund your first investment?/));
      await selectEvent.select(screen.getByLabelText(/How will you fund your first investment?/), ['USK']);

      // enter initial deposit
      const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
      await waitFor(() => userEvent.type(input, '1'), { timeout: 5000 });

      // select resulting denom
      await selectEvent.select(screen.getByLabelText(/What asset do you want to invest in?/), ['NBTC']);

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)));

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
        initialDeposit: 1,
        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
      });

      expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/create-strategy/dca-in/customise', query: undefined });
    });
  });
});
