import { Strategy } from '@hooks/useStrategies';

const startedAt = new Date(2022, 4, 21, 17, 0, 0, 0).getTime();

export default {
  id: '1',
  created_at: '0',
  owner: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
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
  trigger_id: '1',
  trigger_variant: 'time',
  started_at: (startedAt * 1000000).toString(),
  destinations: [
    {
      address: 'kujitestwallet',
      allocation: '1',
    },
  ],
} as Strategy;

export const dcaOutStrategy = {
  id: '1',
  created_at: '0',
  owner: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
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
  trigger_id: '1',
  trigger_variant: 'time',
  started_at: (startedAt * 1000000).toString(),
  destinations: [
    {
      address: 'kujitestwallet',
      allocation: '1',
    },
  ],
} as Strategy;
