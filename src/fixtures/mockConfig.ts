import { Config } from 'src/interfaces/v2/generated/response/get_config';

export const mockConfig: Config = {
  admin: 'adminaddress',
  automation_fee_percent: '1.0',
  default_page_limit: 1,
  default_slippage_tolerance: '1.0',
  default_swap_fee_percent: '1.0',
  exchange_contract_address: 'address',
  executors: ['address'],
  fee_collectors: [{ address: 'address', allocation: '1.0' }],
  old_staking_router_address: 'address',
  paused: false,
  risk_weighted_average_escrow_level: '1.0',
  twap_period: 1,
  weighted_scale_swap_fee_percent: '1.0',
};
