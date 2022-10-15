import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import useStrategies, { Strategy } from '@hooks/useStrategies';
import mockStrategyData from 'src/fixtures/strategy';
import Home from './index.page';
import '@testing-library/jest-dom';
import { queryClient } from './_app.page';

jest.mock('@hooks/useStrategies');
jest.mock('@wizard-ui/react');

function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

function renderTarget() {
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>,
  );
}

describe('Home', () => {
  beforeEach(() => {
    (useStrategies as jest.Mock).mockImplementation(() => ({
      isLoading: false,
    }));
    (useWallet as jest.Mock).mockImplementation(() => ({
      connected: true,
    }));
  });
  it('renders the heading', () => {
    renderTarget();
    expect(screen.getByText(/Welcome to CALC/)).toBeInTheDocument();
  });

  describe('when no wallet connected', () => {
    beforeEach(() => {
      (useWallet as jest.Mock).mockImplementation(() => ({
        connected: false,
      }));
    });
    it('does not show active strategies count', () => {
      renderTarget();
      expect(screen.queryByText(/My Active CALC Strategies/)).toBeNull();
    });
  });
  describe('when wallet is connected', () => {
    describe('when no active strategies exist', () => {
      it('shows info panel', () => {
        renderTarget();
        expect(screen.getByText(/Dollar-cost averaging/)).toBeInTheDocument();
      });
      it('does not show warning panel', () => {
        renderTarget();
        expect(screen.queryByText(/Be Aware/)).toBeNull();
      });
      it('show active strategies count', () => {
        renderTarget();
        expect(screen.getByText(/My Active CALC Strategies/)).toBeInTheDocument();
        expect(screen.getByText(/Set up a strategy/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('0');
      });
      it('does not show investment thesis', () => {
        renderTarget();
        expect(screen.queryByText(/My Investment Thesis/)).toBeNull();
      });
    });
    describe('when active strategies exist', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          isLoading: false,
          data: { vaults: [mockStrategy(), mockStrategy({ status: 'inactive' })] },
        }));
      });
      it('show active strategies count', () => {
        renderTarget();
        expect(screen.getByText(/My Active CALC Strategies/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('1');
        expect(screen.getByText(/Create new strategy/)).toBeInTheDocument();
        expect(screen.getByText(/Review My Strategies/)).toBeInTheDocument();
      });
      it('does not show info panel', () => {
        renderTarget();
        expect(screen.queryByText(/Dollar-cost averaging/)).toBeNull();
      });
      it('shows warning panel', () => {
        renderTarget();
        expect(screen.getByText(/Be Aware/)).toBeInTheDocument();
      });
      it('shows investment thesis', () => {
        renderTarget();
        expect(screen.getByText(/My Investment Thesis/)).toBeInTheDocument();
        expect(screen.queryAllByTestId('denom-icon-ukuji').length).toEqual(1);
        // expect(screen.getByTestId('total-invested').innerHTML).toBe('10,000.00');
        expect(screen.getByTestId('total-invested').innerHTML).toBe('(Coming Soon)');
      });
    });
  });
});
