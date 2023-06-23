import { VaultStatus } from 'src/interfaces/v2/generated/query';
import { BaseDenom, TimeInterval } from 'src/interfaces/v2/generated/execute';
import { PositionType } from 'src/interfaces/generated-osmosis/response/get_vault';
import { Strategy } from '@models/Strategy';
import { mockTimeTrigger } from './trigger';

const startedAt = new Date(2022, 4, 21, 17, 0, 0, 0).getTime();

export const dcaInStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujiratestwallet',
  balance: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  escrow_level: '0',
  escrowed_amount: {
    denom: 'ukuji',
    amount: '0',
  },

  time_interval: 'weekly' as TimeInterval,
  deposited_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  target_denom: 'ukuji',
  swap_amount: '1000000', // 1 DEMO
  status: 'active' as VaultStatus,
  trigger_variant: 'time',
  started_at: (startedAt * 1000000).toString(),
  received_amount: {
    denom: 'ukuji',
    amount: '1000000', // 1 DEMO
  },
  swapped_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '1000000', // 1 UKUJI
  },
  destinations: [
    {
      address: 'kujiratestwallet',
      allocation: '1',
    },
  ],
  trigger: mockTimeTrigger,
  dca_plus_config: null,
  slippage_tolerance: '0.2',
};

export const dcaOutStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujiratestwallet',
  balance: {
    denom: 'ukuji',
    amount: '10000000',
  },

  time_interval: 'weekly' as TimeInterval,
  target_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  escrow_level: '0',
  escrowed_amount: {
    denom: 'ukuji',
    amount: '0',
  },
  deposited_amount: {
    denom: 'ukuji',
    amount: '10000000',
  },
  swap_amount: '1000000',
  slippage_tolerance: '0.2',
  status: 'active' as VaultStatus,
  trigger_variant: 'time',
  started_at: (startedAt * 1000000).toString(),
  swapped_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '1000000', // 1 DEMO
  },
  received_amount: {
    denom: 'ukuji',
    amount: '1000000', // 1 UKUJI
  },
  destinations: [
    {
      address: 'kujiratestwallet',
      allocation: '1',
    },
  ],
  dca_plus_config: null,
};

export const dcaInStrategyViewModal = {
  id: '1',
  owner: 'kujiratestwallet',
  rawData: dcaInStrategy,
  status: 'active',
};

export const dcaPlusStrategy = {
  ...dcaInStrategy,
  performance_assessment_strategy: {
    compare_to_standard_dca: {
      received_amount: {
        denom: 'ukuji',
        amount: '1000000', // 1 UKUJI
      },
      swapped_amount: {
        denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
        amount: '1000000', // 1 DEMO
      },
    },
  },
  swap_adjustment_strategy: {
    risk_weighted_average: {
      base_denom: 'bitcoin' as BaseDenom,
      model_id: 1,
      position_type: 'enter' as PositionType,
    },
  },
};

export const dcaPlusStrategyViewModal: Strategy = {
  id: '1',
  owner: 'kujiratestwallet',
  status: 'active',
  rawData: dcaPlusStrategy,
};
