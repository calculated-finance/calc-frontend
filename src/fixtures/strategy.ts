import { Strategy } from '@hooks/useStrategies';

export default {
  id: '1',
  created_at: '0',
  owner: 'kujira13zatchjvrqvtkg2asfxnjmnsur3e7faszm49mt',
  balance: {
    denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
    amount: '10000',
  },

  time_interval: 'weekly',
  pair: {
    address: 'kujira1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrsqq4jjh',
    base_denom: 'ukuji',
    quote_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
  },
  swap_amount: '10000',
  position_type: 'enter',
  slippage_tolerance: null,
  status: 'active',
  trigger_id: '1',
  trigger_variant: 'time',
  destinations: [
    {
      address: 'kujitestwallet',
      allocation: '1',
    },
  ],
} as Strategy;
