import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useCWClient, useExecuteContract, useWallet } from '@wizard-ui/react';
import { Strategy } from '@hooks/useStrategies';
import mockStrategyData from 'src/fixtures/strategy';
import '@testing-library/jest-dom';
import { queryClient } from 'src/pages/_app.page';
import { useRouter } from 'next/router';
import { when } from 'jest-when';
import { CONTRACT_ADDRESS } from 'src/constants';
import Page from './index.page';

jest.mock('@wizard-ui/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function mockStrategy(data?: Partial<Strategy>) {
  return {
    ...mockStrategyData,
    ...data,
  };
}

function renderTarget() {
  render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>,
  );
}

describe('Home', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockImplementation(() => ({
      address: 'kujitestwallet',
      connected: true,
    }));
    (useCWClient as jest.Mock).mockImplementation(() => {
      const queryContractSmart = jest.fn();
      when(queryContractSmart)
        .calledWith(CONTRACT_ADDRESS, {
          get_vault: {
            vault_id: '1',
            address: 'kujitestwallet',
          },
        })
        .mockResolvedValue({ vault: mockStrategy() });
      return {
        queryContractSmart,
      };
    });

    (useExecuteContract as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
    }));

    (useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/', query: { id: '1' } }));
  });
  it('renders the heading', async () => {
    renderTarget();
    screen.debug();
    await waitFor(() => expect(screen.getByTestId('details-heading').textContent).toBe('DCA In 1'));
  });
});
