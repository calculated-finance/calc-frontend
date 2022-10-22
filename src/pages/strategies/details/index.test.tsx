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
import { mockPriceTrigger, mockTimeTrigger } from 'src/fixtures/trigger';
import { UseStrategyResponse } from '@hooks/useStrategy';
import { Trigger } from '@models/Trigger';
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

function mockUseStrategy(data: Partial<UseStrategyResponse> = {}) {
  (useCWClient as jest.Mock).mockImplementation(() => {
    const queryContractSmart = jest.fn();
    when(queryContractSmart)
      .calledWith(CONTRACT_ADDRESS, {
        get_vault: {
          vault_id: '1',
          address: 'kujitestwallet',
        },
      })
      .mockResolvedValueOnce({ vault: mockStrategy(), trigger: mockTimeTrigger, ...data });
    return {
      queryContractSmart,
    };
  });
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
    jest.clearAllMocks();
    (useWallet as jest.Mock).mockImplementation(() => ({
      address: 'kujitestwallet',
      connected: true,
    }));

    (useExecuteContract as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
    }));

    (useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/', query: { id: '1' } }));
  });
  it('renders the heading', async () => {
    mockUseStrategy();

    renderTarget();
    await waitFor(() => expect(screen.getByTestId('details-heading').textContent).toBe('DCA In 1'));
  });
  describe('next swap', () => {
    describe('when strategy is completed', () => {
      it('does not render next swap', async () => {
        mockUseStrategy({ vault: mockStrategy({ status: 'inactive' }) });

        renderTarget();
        await waitFor(() => expect(screen.queryAllByTestId('next-swap-info')).toEqual([]));
      });
    });
    describe('when strategy is not completed', () => {
      describe('when time trigger is set', () => {
        it('renders next swap', async () => {
          mockUseStrategy();

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('May 22, 2022 at 5:00 PM'));
        });
      });
      describe('when price trigger is set', () => {
        it('renders next swap', async () => {
          mockUseStrategy({ trigger: mockPriceTrigger });

          renderTarget();
          await waitFor(() => expect(screen.getByTestId('next-swap-info').textContent).toBe('When 1 KUJI ≤ 0.5 DEMO'));
        });
      });
    });
  });
});
