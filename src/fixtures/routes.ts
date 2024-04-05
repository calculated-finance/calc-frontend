import { ArchwayMainnetDenoms } from '@models/Denom';

export const ARCHWAY_MAINNET: { [x: string]: { [x: string]: any[] } } = {
  [ArchwayMainnetDenoms.ARCH]: {
    [ArchwayMainnetDenoms.ATOM]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.AKT]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.AKT]: {
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ATOM]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.ATOM]: {
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.AKT]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_6' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.axlUSDC]: {
    [ArchwayMainnetDenoms.ARCH]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.AKT]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ATOM]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.gravUSDC]: {
    [ArchwayMainnetDenoms.AKT]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ATOM]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.USDC]: {
    [ArchwayMainnetDenoms.AKT]: [
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ATOM]: [
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.gravUSDT]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
    ],
  },
  [ArchwayMainnetDenoms.gravUSDT]: {
    [ArchwayMainnetDenoms.AKT]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
      { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.ATOM]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
      { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
    [ArchwayMainnetDenoms.axlUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
      { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
      { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
    ],
    [ArchwayMainnetDenoms.USDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    ],
    [ArchwayMainnetDenoms.gravUSDC]: [
      { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
  },
};

export const ARCHWAY_TESTNET: { [x: string]: { [x: string]: any[] } } = {
  [ArchwayMainnetDenoms.ARCH]: {
    [ArchwayMainnetDenoms.ATOM]: [
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
  },
  [ArchwayMainnetDenoms.ATOM]: {
    [ArchwayMainnetDenoms.ARCH]: [
      { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
      { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 1 } },
      { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
    ],
  },
};

export const ROUTES: Record<string, { [x: string]: { [x: string]: any[] } }> = {
  'archway-1': ARCHWAY_MAINNET,
  'constantine-3': ARCHWAY_TESTNET,
};
