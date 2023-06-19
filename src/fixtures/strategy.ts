import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
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

  time_interval: 'weekly',
  deposited_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  target_denom: 'ukuji',
  swap_amount: '1000000', // 1 DEMO
  status: 'active',
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
} as Strategy;

export const dcaOutStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujiratestwallet',
  balance: {
    denom: 'ukuji',
    amount: '10000000',
  },

  time_interval: 'weekly',
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
  status: 'active',
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
} as Strategy;

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
      base_denom: 'bitcoin',
      model_id: 1,
      position_type: 'enter',
    },
  },
} as Strategy;

export const osmosisStrategy = {
  balance: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  created_at: '0',
  owner: 'kujiratestwallet',
  deposited_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  destinations: [],
  escrow_level: '0',
  escrowed_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '0',
  },
  id: '1',
  label: null,
  minimum_receive_amount: null,
  performance_assessment_strategy: null,
  received_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },
  slippage_tolerance: '0.01',
  started_at: '1',
  status: 'active',
  swap_adjustment_strategy: null,
  swap_amount: '1000',
  swapped_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '0',
  },
  target_denom: 'ukuji',
  time_interval: 'daily',
  trigger: null,
} as StrategyOsmosis;

export default dcaInStrategy;
