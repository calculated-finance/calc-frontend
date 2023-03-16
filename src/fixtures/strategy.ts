import { Strategy } from '@hooks/useStrategies';
import { mockTimeTrigger } from './trigger';

const startedAt = new Date(2022, 4, 21, 17, 0, 0, 0).getTime();

const dcaInStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujitestwallet',
  balance: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000000', // 10 DEMO
  },

  time_interval: 'weekly',
  pair: {
    address: 'kujira1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrsqq4jjh',
    base_denom: 'ukuji',
    quote_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  },
  swap_amount: '1000000', // 1 DEMO
  slippage_tolerance: null,
  status: 'active',
  trigger_variant: 'time',
  started_at: (startedAt * 1000000).toString(),
  received_amount: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '1000000', // 1 DEMO
  },
  swapped_amount: {
    denom: 'ukuji',
    amount: '1000000', // 1 UKUJI
  },
  destinations: [
    {
      address: 'kujitestwallet',
      allocation: '1',
      action: 'send',
    },
  ],
  trigger: mockTimeTrigger,
  dca_plus_config: null,
} as Strategy;

export const dcaOutStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujitestwallet',
  balance: {
    denom: 'ukuji',
    amount: '10000000',
  },

  time_interval: 'weekly',
  pair: {
    address: 'kujira1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrsqq4jjh',
    base_denom: 'ukuji',
    quote_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  },
  swap_amount: '1000000',
  slippage_tolerance: null,
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
      address: 'kujitestwallet',
      allocation: '1',
      action: 'send',
    },
  ],
  dca_plus_config: null,
} as Strategy;

export const dcaPlusStrategy = {
  ...dcaInStrategy,
  dca_plus_config: {
    escrow_level: '1',
    escrowed_balance: '10000',
    model_id: 1,
    standard_dca_received_amount: '10000',
    standard_dca_swapped_amount: '1000',
    total_deposit: '1000',
  },
};

export default dcaInStrategy;
