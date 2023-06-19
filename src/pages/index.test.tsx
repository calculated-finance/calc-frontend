import { act, render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@hooks/useWallet';
import {useStrategiesCosmos, Strategy } from '@hooks/useStrategies';
import mockStrategyData from 'src/fixtures/strategy';
import { queryClient } from '@helpers/test/testQueryClient';
import Home from './index.page';
import '@testing-library/jest-dom';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/',
  query: { id: '1' , chain: 'Kujira'},
  events: {
    on: jest.fn(),
  },
};

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

jest.mock('@hooks/useStrategies');
jest.mock('@hooks/useWallet');

function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

async function renderTarget() {
  await act(() => render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>,
  ));
}

describe('Home', () => {
  beforeEach(() => {
    (useStrategiesCosmos as jest.Mock).mockImplementation(() => ({
      isLoading: false,
    }));
    (useWallet as jest.Mock).mockImplementation(() => ({
      connected: true,
    }));
  });
  it.only('renders the heading', async () => {
    await renderTarget();
    expect(screen.getByText(/Welcome to CALC/)).toBeInTheDocument();
  });

  describe('when no wallet connected', () => {
    beforeEach(() => {
      (useWallet as jest.Mock).mockImplementation(() => ({
        connected: false,
      }));
    });
    it('does not show active strategies count', async () => {
      await renderTarget();
      expect(screen.queryByText(/My active CALC strategies/)).toBeNull();
    });
  });
  describe('when wallet is connected', () => {
    describe('when no active strategies exist', () => {
      it('shows info panel', async () => {
        await renderTarget();
        expect(screen.getByText(/Stay ice cold/)).toBeInTheDocument();
      });
      it('does not show warning panel', async () => {
        await renderTarget();
        expect(screen.queryByText(/Be Aware/)).toBeNull();
      });
      it('show active strategies count', async () => {
        await renderTarget();
        expect(screen.getByText(/My active CALC strategies/)).toBeInTheDocument();
        expect(screen.getByText(/Set up a strategy/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('0');
      });
      it('does not show investment thesis', async () => {
        await renderTarget();
        expect(screen.queryByText(/My thesis/)).toBeNull();
      });
    });
    describe('when active strategies exist', () => {
      beforeEach(() => {
        (useStrategiesCosmos as jest.Mock).mockImplementation(() => ({
          isLoading: false,
          data: { vaults: [mockStrategy(), mockStrategy({ status: 'inactive' })] },
        }));
      });
      it('show active strategies count', async () => {
        await renderTarget();
        expect(screen.getByText(/My active CALC strategies/)).toBeInTheDocument();
        expect(screen.getByTestId('active-strategy-count').innerHTML).toBe('1');
        expect(screen.getByText(/Create new strategy/)).toBeInTheDocument();
        expect(screen.getByText(/Review my strategies/)).toBeInTheDocument();
      });
      it('does not show info panel', async () => {
        await renderTarget();
        expect(screen.queryByText(/Dollar-cost averaging/)).toBeNull();
      });
      it('shows warning panel', async () => {
        await renderTarget();
        expect(screen.getByText(/Be Aware/)).toBeInTheDocument();
      });
      it('shows investment thesis', async () => {
        await renderTarget();
        expect(screen.getByText(/My thesis/)).toBeInTheDocument();
        expect(screen.queryAllByTestId('denom-icon-ukuji').length).toEqual(1);
      });
    });
  });
});
