import { act, render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@hooks/useWallet';
import { useStrategies } from '@hooks/useStrategies';
import { dcaInStrategyViewModal } from 'src/fixtures/strategy';
import { queryClient } from '@helpers/test/testQueryClient';
import { Strategy, StrategyStatus } from '@models/Strategy';
import Home from './index.page';
import '@testing-library/jest-dom';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/',
  query: { id: '1', chain: 'Kujira' },
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
    ...dcaInStrategyViewModal,
    ...data,
  };
}

async function renderTarget() {
  await act(() =>
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    ),
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
  it('renders the heading', async () => {
    await renderTarget();
    expect(screen.getByText(/Welcome to CALC/)).toBeInTheDocument();
  });
});
describe('when active strategies exist', () => {
  beforeEach(() => {
    (useStrategies as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: [mockStrategy(), mockStrategy({ status: StrategyStatus.COMPLETED })],
    }));
  });
  it('show active strategies count', async () => {
    await renderTarget();
    expect(screen.getByText(/My active CALC strategies/)).toBeInTheDocument();
    expect(screen.getByTestId('my-active-strategy-count').innerHTML).toBe('1');
  });

  it('shows investment thesis', async () => {
    await renderTarget();
    expect(screen.getByText(/My thesis/)).toBeInTheDocument();
    expect(screen.queryAllByTestId('denom-icon-ukuji').length).toEqual(1);
  });
});
