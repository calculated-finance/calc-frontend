import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '@wizard-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'src/pages/_app.page';
import useStrategies from '@hooks/useStrategies';
import TopPanel from './TopPanel';

jest.mock('@wizard-ui/react');
jest.mock('@hooks/useStrategies');

describe('top panel', () => {
  beforeEach(() => {
    (useStrategies as jest.Mock).mockImplementation(() => ({
      isLoading: false,
    }));
  });
  describe('when user has not connected to a wallet', () => {
    beforeEach(() => {
      (useWallet as jest.Mock).mockImplementation(() => ({
        connected: false,
      }));
    });
    it('renders the connect wallet button', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <TopPanel />
        </QueryClientProvider>,
      );

      expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
    });
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
        expect(screen.getByText(/Get Started/)).toBeInTheDocument();
      });
    });
    describe('when a strategy set', () => {
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
        expect(screen.getByText(/Top up my Strategy/)).toBeInTheDocument();
        expect(screen.getByText(/Review performance/)).toBeInTheDocument();
      });
    });
  });
});
