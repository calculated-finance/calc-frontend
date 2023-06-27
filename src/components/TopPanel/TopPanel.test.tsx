import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '@hooks/useWallet';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@helpers/test/testQueryClient';
import { Chains } from '@hooks/useChain/Chains';
import { useStrategies } from '@hooks/useStrategies';
import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import { Strategy, StrategyStatus } from '@models/Strategy';
import TopPanel from './TopPanel';

function buildStrategy(data: Partial<Strategy> = {}): Strategy {
  return {
    ...dcaInStrategyViewModal,
    ...data,
  };
}

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/',
  query: { chain: Chains.Kujira },
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

jest.mock('@hooks/useWallet');
jest.mock('@hooks/useStrategies');

describe('top panel', () => {
  beforeEach(() => {
    (useStrategies as jest.Mock).mockImplementation(() => ({
      isLoading: false,
    }));
  });

  describe('when user has connected to a wallet', () => {
    beforeEach(() => {
      (useWallet as jest.Mock).mockImplementation(() => ({
        connected: true,
      }));
    });
    describe('when a user has no strategies set', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          isLoading: false,
        }));
      });
      it('renders the new to CALC panel', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/New to CALC?/)).toBeInTheDocument();
      });
      it('"learn about CALC" takes user to the correct page', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );
        expect(screen.getByText(/Learn how CALC works/)).toContainHTML('a');
        expect(screen.getByText(/Learn how CALC works/)).toBeVisible();
      });
    });
    describe('when a user has only completed strategies', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: [buildStrategy({ id: '1', status: StrategyStatus.COMPLETED })],
          isLoading: false,
        }));
      });
      it('renders the connect wallet button', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/Ready to fire up CALC again?/)).toBeInTheDocument();
        expect(screen.getByText(/Create new strategy/)).toHaveAttribute('href', '/create-strategy?chain=Kujira');
        expect(screen.getByText(/Review past strategies/)).toHaveAttribute('href', '/strategies?chain=Kujira');
      });
    });
    describe('when a single strategy is set', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: [buildStrategy({ id: '1', status: StrategyStatus.ACTIVE })],
          isLoading: false,
        }));
      });
      it('renders the connect wallet button', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/Awesome - you have a calculated strategy active!/)).toBeInTheDocument();
        expect(screen.getByText(/Top up my strategy/)).toHaveAttribute('href', '/strategies/top-up?id=1&chain=Kujira');
        expect(screen.getByText(/Review performance/)).toHaveAttribute('href', '/strategies/details?id=1&chain=Kujira');
      });
    });
    describe('when multiple strategies are set', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: [
            buildStrategy({ id: '1', status: StrategyStatus.ACTIVE }),
            buildStrategy({ id: '2', status: StrategyStatus.ACTIVE }),
          ],
          isLoading: false,
        }));
      });
      it('renders the connect wallet button', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/Wow - you're a CALC pro./)).toBeInTheDocument();
        expect(screen.getByText(/See my strategies/)).toHaveAttribute('href', '/strategies?chain=Kujira');
        expect(screen.getByText(/Share with others/)).toHaveAttribute(
          'href',
          'https://twitter.com/intent/tweet?text=I%27ve%20got%20a%20few%20strategies%20running%20on%20%40CALC_FINANCE%20-%20come%20check%20them%20out!%20App.calculated.fi',
        );
      });
    });
  });
});
