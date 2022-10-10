import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import useStrategies from '@hooks/useStrategies';
import Home from './index.page';
import '@testing-library/jest-dom';
import { queryClient } from './_app.page';

jest.mock('@hooks/useStrategies');
jest.mock('@wizard-ui/react');

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
      it('show active strategies count', () => {
        renderTarget();
        expect(screen.getByText(/My Active CALC Strategies/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('0');
      });
    });
    describe('when active strategies exist', () => {
      beforeEach(() => {
        (useStrategies as jest.Mock).mockImplementation(() => ({
          isLoading: false,
          data: { vaults: [{ status: 'active' }, { status: 'inactive' }] },
        }));
      });
      it('show active strategies count', () => {
        renderTarget();
        expect(screen.getByText(/My Active CALC Strategies/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('1');
      });
    });
  });
});
