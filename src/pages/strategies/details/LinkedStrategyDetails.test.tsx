import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { StrategyStatus } from '@models/Strategy';
import { LinkedStrategyDetails } from './LinkedStrategyDetails';

type VaultStatus = 'scheduled' | 'active' | 'inactive' | 'cancelled';

const mockLinkedVault = {
  status: 'active' as StrategyStatus,
  id: '222',
  owner: 'cosmos1mumzgqekvhvn9fkzj8tajen0qw9j7lj29tgcj2',
  rawData: {
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
    id: '222',
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
  },
};
const mockVault = {
  status: 'active' as StrategyStatus,
  id: '111',
  owner: 'cosmos1mumzgqekvhvn9fkzj8tajen0qw9j7lj29tgcj2',
  rawData: {
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
  },
};

beforeEach(() => {
  jest.resetModules();
});

describe('LinkedStrategyDetails', () => {
  it('should render "total value" text ', async () => {
    render(
      <LinkedStrategyDetails
        originalStrategy={mockVault}
        originalStrategyValue={10}
        linkedToStrategy={mockLinkedVault}
        resultingDenomPrice={5}
      />,
    );
    const titleElement = screen.getByText(/linked strategy total value:/i);
    expect(titleElement).toHaveTextContent('Linked strategy total value:');
  });

  it('should render original strategies value', async () => {
    render(
      <LinkedStrategyDetails
        originalStrategy={mockVault}
        originalStrategyValue={10}
        linkedToStrategy={mockLinkedVault}
        resultingDenomPrice={5}
      />,
    );
    const originalValue = screen.getByTestId('strategy-asset-price');
    expect(originalValue).toHaveTextContent('$10.00 USD');
  });
  it('should render combined strategies value', async () => {
    render(
      <LinkedStrategyDetails
        originalStrategy={mockVault}
        originalStrategyValue={2}
        linkedToStrategy={mockLinkedVault}
        resultingDenomPrice={99}
      />,
    );
    const combinedValue = screen.getByTestId('combined-strategy-value');
    expect(combinedValue.textContent).toBe('$2.00 USD');
  });

  it('should render linked strategies ID', async () => {
    render(
      <LinkedStrategyDetails
        originalStrategy={mockVault}
        originalStrategyValue={10}
        linkedToStrategy={mockLinkedVault}
        resultingDenomPrice={5}
      />,
    );
    const linkedIdElement = screen.getByTestId('linked-strategy-id');
    expect(linkedIdElement).toHaveTextContent('222');
  });
});
