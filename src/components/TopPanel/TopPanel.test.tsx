import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '@hooks/useWallet';
import { QueryClientProvider } from '@tanstack/react-query';
import useStrategies from '@hooks/useStrategies';
import { queryClient } from '@helpers/test/testQueryClient';
import TopPanel from './TopPanel';

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
      it('renders the connect wallet button', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/Ready to set up a CALC Strategy?/)).toBeInTheDocument();
        expect(screen.getByText(/Get started/)).toHaveAttribute('href', '/create-strategy');
      });
    });
    describe('when a user has only completed strategies', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: {
            vaults: [{ id: 1, status: 'inactive' }],
          },
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
        expect(screen.getByText(/Create new strategy/)).toHaveAttribute('href', '/create-strategy');
        expect(screen.getByText(/Review past strategies/)).toHaveAttribute('href', '/strategies');
      });
    });
    describe('when a single strategy is set', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: {
            vaults: [{ id: 1, status: 'active' }],
          },
          isLoading: false,
        }));
      });
      it('renders the connect wallet button', () => {
        render(
          <QueryClientProvider client={queryClient}>
            <TopPanel />
          </QueryClientProvider>,
        );

        expect(screen.getByText(/Awesome - you have a DCA strategy active!/)).toBeInTheDocument();
        expect(screen.getByText(/Top up my strategy/)).toHaveAttribute('href', '/strategies/top-up?id=1');
        expect(screen.getByText(/Review performance/)).toHaveAttribute('href', '/strategies/details?id=1');
      });
    });
    describe('when multiple strategies are set', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          data: {
            vaults: [
              { id: 1, status: 'active' },
              { id: 2, status: 'active' },
            ],
          },
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
        expect(screen.getByText(/See my strategies/)).toHaveAttribute('href', '/strategies');
        expect(screen.getByText(/Share with others/)).toHaveAttribute(
          'href',
          'https://twitter.com/intent/tweet?text=I%27ve%20got%20a%20few%20strategies%20running%20on%20%40CALC_FINANCE%20-%20come%20check%20them%20out!%20App.calculated.fi',
        );
      });
    });
  });
});
