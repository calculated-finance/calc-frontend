import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { getStrategyPostSwapType } from '@helpers/destinations';
import { osmosisStrategy } from 'src/fixtures/strategy';
import { Destination } from 'src/interfaces/generated-osmosis/response/get_vault';
import { Chains, useChainStore } from '@hooks/useChain';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { getChainContractAddress } from '@helpers/chains';
import { mockUseStrategy } from '@helpers/test/mockGetVault';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { DestinationDetails } from './DestinationDetails';

// Mocking getStrategyPostSwapType
jest.mock('@helpers/destinations', () => ({
  ...jest.requireActual('@helpers/destinations'),
  getStrategyPostSwapType: jest.fn(),
}));
jest.mock('@hooks/useWallet');
const mockRouter = {
  isReady: true,
  push: jest.fn(),
  pathname: '/create-strategy/dca-plus-in/assets',
  query: { id: '1' },
  events: {
    on: jest.fn(),
  },
};

function renderWithQueryClient(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

function strategyWithDestination(destination: Destination | undefined = { address: '1234', allocation: '1.0' }) {
  return {
    ...osmosisStrategy,
    destinations: [destination],
  };
}

describe('<DestinationDetails />', () => {
  it('renders ValidatorDetails when postSwapExecutionType is Stake', () => {
    useChainStore.setState({ chain: Chains.Osmosis });
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.Stake);
    const { getByText } = renderWithQueryClient(<DestinationDetails strategy={strategyWithDestination()} />);

    waitFor(() => expect(getByText('Auto staking status')).toBeInTheDocument());
  });

  it('renders Mars link when postSwapExecutionType is GenerateYield', () => {
    useChainStore.setState({ chain: Chains.Osmosis });
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.GenerateYield);
    const { getByText } = renderWithQueryClient(<DestinationDetails strategy={strategyWithDestination()} />);

    waitFor(() => expect(getByText('Mars')).toBeInTheDocument());
  });

  it('renders ReinvestDetails when postSwapExecutionType is Reinvest', () => {
    useChainStore.setState({ chain: Chains.Osmosis });
    mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.Reinvest);
    const { getByText } = renderWithQueryClient(
      <DestinationDetails
        strategy={strategyWithDestination({
          address: getChainContractAddress(Chains.Osmosis),
          allocation: '1.0',
          msg: Buffer.from(
            JSON.stringify({
              deposit: {
                vault_id: '1',
                address: '2345',
              },
            }),
          ).toString('base64'),
        })}
      />,
    );

    waitFor(() => expect(getByText('Reinvesting into')).toBeInTheDocument());
  });

  it('renders ConfigureButton when chain is Osmosis', () => {
    (getStrategyPostSwapType as jest.Mock).mockReturnValueOnce(PostPurchaseOptions.SendToWallet);
    useChainStore.setState({ chain: Chains.Osmosis });

    const { getByText } = renderWithQueryClient(<DestinationDetails strategy={strategyWithDestination()} />);

    expect(getByText('Configure')).toBeInTheDocument();
  });

  // Write similar tests for other cases...
});
