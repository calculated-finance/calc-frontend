import { act, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import userEvent from '@testing-library/user-event';
import { ChangeEvent } from 'react';
import { SingleDatepickerProps } from 'chakra-dayzed-datepicker';
import { useFormStore } from '@hooks/useFormStore';
import Page from './index.page';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/weighted-scale-out/customise',
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
    weightedScaleOut: {
      initialDenom: 'ukuji',
      initialDeposit: 60,
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

describe('DCA Plus Out customise page', () => {
  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

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

      expect(within(screen.getByTestId('strategy-modal-header')).getByText('Customise Strategy')).toBeInTheDocument();
    });
  });

  describe('when form is filled and submitted', () => {
    it('submits form successfully', async () => {
      mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

      await renderTarget();

      // submit
      await waitFor(() => userEvent.click(screen.getByText(/Next/)), { timeout: 5000 });

      expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
        advancedSettings: false,
        slippageTolerance: 2,
        strategyDuration: 60,
      });

      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/create-strategy/weighted-scale-out/post-purchase',
        query: undefined,
      });
    });
  });
});
