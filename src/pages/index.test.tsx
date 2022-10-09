import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import useStrategies from '@hooks/useStrategies';
import Home from './index.page';
import '@testing-library/jest-dom';
import { queryClient } from './_app.page';

jest.mock('@hooks/useStrategies');

describe('Home', () => {
  beforeEach(() => {
    (useStrategies as jest.Mock).mockImplementation(() => ({
      isLoading: false,
    }));
  });
  it('renders the heading', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Welcome to CALC/)).toBeInTheDocument();
  });
});
