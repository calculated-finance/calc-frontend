import { act, render, screen } from '@testing-library/react';
import StrategyUrls from 'src/pages/create-strategy/StrategyUrls';
import '@testing-library/jest-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { AssetPageStrategyButtons } from '.';

const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-in/success',
};

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

async function renderTarget() {
  act(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>,
    );
  });
}

describe('AssetsTabsSelectors tests', () => {
  it('renders strategy category radio selectors', () => {
    render(<AssetPageStrategyButtons />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
  it('renders strategy type buttons', () => {
    render(<AssetPageStrategyButtons />);
    expect(screen.getByTestId('strategy-type-buttons')).toBeInTheDocument();
  });
  it('changes page when strategy type buttons are clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AssetPageStrategyButtons />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/DCA In/)).toHaveAttribute('href', StrategyUrls.DCAIn);
  });
});
