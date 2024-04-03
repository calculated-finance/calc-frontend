import { ArchwayMainnetDenoms } from '@models/Denom';

export const ARCHWAY_MAINNET: { [x: string]: { [x: string]: any[] } } = {
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
