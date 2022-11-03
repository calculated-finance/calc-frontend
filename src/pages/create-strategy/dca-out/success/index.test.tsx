import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { mockUseWallet } from 'src/helpers/test/mockUseWallet';
import { mockUseStrategy } from 'src/helpers/test/mockGetVault';
import Page from './index.page';

const mockRouter = {
  push: jest.fn(),
  pathname: '/create-strategy/dca-out/success',
  query: { strategyId: '1', timeSaved: 100 },
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

function renderTarget() {
  render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>,
  );
}

describe('DCA Out success page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the heading', async () => {
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());

    renderTarget();
    screen.debug();

    await waitFor(() =>
      expect(
        within(screen.getByTestId('strategy-modal-header')).getByText('Strategy Set Successfully'),
      ).toBeInTheDocument(),
    );
  });
  it('renders time saved', async () => {
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());
    renderTarget();
    screen.getByText('100 minutes');
  });
  it('shows link to my strategies page', async () => {
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());

    renderTarget();

    await waitFor(() => expect(screen.getByText(/View my strategies/)).toHaveAttribute('href', '/strategies'));
  });
});
