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
  pathname: '/create-strategy/dca-out/assets',
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

describe('DCA Out Assets page', () => {
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
      await waitFor(() => screen.getByText(/What position do you want to take profit on?/));
      await selectEvent.select(screen.getByLabelText(/What position do you want to take profit on?/), ['KUJI']);

      // enter initial deposit
      const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
      await waitFor(() => userEvent.type(input, '1'));

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
        query: undefined,
      });
    });
  });
});
