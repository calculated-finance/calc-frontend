import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LinkedStrategyDetails } from './LinkedStrategyDetails';

export type VaultStatus = 'scheduled' | 'active' | 'inactive' | 'cancelled';

export const mockVault = {
  balance: {
    amount: '12',
    denom: 'ukuji',
  },
  created_at: '1686988860836',
  deposited_amount: {
    amount: '12',
    denom: 'ukuji',
  },
  destinations: [
    {
      address: 'kujira1e6fjnq7q20sh9cca76wdkfg69esha5zn53jjewrtjgm4nktk824stzyysu',
      allocation: '1',
      msg: null,
    },
  ],
  escrow_level: '0',
  escrowed_amount: {
    amount: '12',
    denom: 'ukuji',
  },
  id: '111',
  label: 'label',
  minimum_receive_amount: '1',
  owner: 'cosmos1mumzgqekvhvn9fkzj8tajen0qw9j7lj29tgcj2',
  performance_assessment_strategy: null,
  received_amount: {
    amount: '12',
    denom: 'ukuji',
  },
  slippage_tolerance: '0.5',
  started_at: '1686988860836',
  status: 'active' as VaultStatus,
  swap_adjustment_strategy: null,
  swap_amount: '2',
  swapped_amount: {
    amount: '12',
    denom: 'ukuji',
  },
  target_denom: 'ukuji',
  time_interval: {
    custom: { seconds: 86400 },
  },
  trigger: null,
};

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('LinkedStrategyDetails', () => {
  it('should render linked strategies component', async () => {
    render(
      <LinkedStrategyDetails
        originalStrategy={mockVault}
        marketValueInFiat={10}
        linkedToStrategy={mockVault}
        initialDenomPrice={5}
      />,
    );
    const titleElement = screen.getByText(/linked strategy total value:/i);
    expect(titleElement).toHaveTextContent('Linked strategy total value:');

    const totalValue = screen.getByTestId('strategy-asset-price');
    expect(totalValue).toHaveTextContent('$10.00 USD');
  });
});
