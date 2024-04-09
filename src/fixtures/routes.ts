import { ChainId } from '@models/ChainId';
import { ArchwayMainnetDenoms } from '@models/Denom';
import { keys, map, reduce } from 'rambda';

type Pool =
  | {
      stable_hop_info: { pool: { id: string }; from_asset_index: number; to_asset_index: number };
    }
  | {
      standard_hop_info: { pool: { id: string }; from_asset_index: number };
    }
  | {
      ratio_hop_info: { pool: { id: string }; from_asset_index: number };
    };

const reverseRoute = (route: Pool[] | undefined) =>
  route &&
  map(
    (pool: Pool) =>
      'stable_hop_info' in pool
        ? {
            stable_hop_info: {
              pool: pool.stable_hop_info.pool,
              from_asset_index: pool.stable_hop_info.to_asset_index,
              to_asset_index: pool.stable_hop_info.from_asset_index,
            },
          }
        : 'standard_hop_info' in pool
        ? {
            standard_hop_info: {
              pool: pool.standard_hop_info.pool,
              from_asset_index: pool.standard_hop_info.from_asset_index === 1 ? 0 : 1,
            },
          }
        : {
            ratio_hop_info: {
              pool: pool.ratio_hop_info.pool,
              from_asset_index: pool.ratio_hop_info.from_asset_index === 1 ? 0 : 1,
            },
          },
    route,
  );

export const ARCHWAY_MAINNET: { [x: string]: Pool[] } = {
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.AKT}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.ATOM}`]: [
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.AKT}`]: [
    { standard_hop_info: { pool: { id: 'standard_6' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.ARCH}`]: [
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.AXV}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_6' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ATOM}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.ARCH}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.AKT}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.ATOM}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.USDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.axlUSDC}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 2 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDC}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 0, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.AKT}`]: [
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.ATOM}`]: [
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.USDC}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 2 } },
  ],
  [`${ArchwayMainnetDenoms.gravUSDT}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_6' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_6' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.JKL}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.ARCH}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.AKT}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.ATOM}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.AXV}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.JKL}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.USDC}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.ANDR}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_23' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.JKL}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_5' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.ANDR}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.BLD}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 0, to_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.AKT}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_3' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_5' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.ARCH}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_27' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.AXV}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_12' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.BLD}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_2' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_2' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.JKL}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_4' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_3' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.ANDR}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_13' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.USDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.axlUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_13' }, from_asset_index: 1, to_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_16' }, from_asset_index: 0 } },
    { standard_hop_info: { pool: { id: 'standard_15' }, from_asset_index: 1 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.gravUSDC}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 0 } },
  ],
  [`${ArchwayMainnetDenoms.OSMO}-${ArchwayMainnetDenoms.gravUSDT}`]: [
    { stable_hop_info: { pool: { id: 'stable_22' }, from_asset_index: 0, to_asset_index: 1 } },
    { ratio_hop_info: { pool: { id: 'hybrid_4' }, from_asset_index: 1 } },
    { stable_hop_info: { pool: { id: 'stable_12' }, from_asset_index: 2, to_asset_index: 1 } },
  ],
};

export const ARCHWAY_TESTNET: { [x: string]: Pool[] } = {
  [`${ArchwayMainnetDenoms.ARCH}-${ArchwayMainnetDenoms.ATOM}`]: [
    { stable_hop_info: { pool: { id: 'stable_6' }, from_asset_index: 0, to_asset_index: 1 } },
    { standard_hop_info: { pool: { id: 'standard_24' }, from_asset_index: 0 } },
    { stable_hop_info: { pool: { id: 'stable_11' }, from_asset_index: 1, to_asset_index: 0 } },
  ],
};

const ROUTES: Record<string, { [x: string]: Pool[] }> = {
  'archway-1': ARCHWAY_MAINNET,
  'constantine-3': ARCHWAY_TESTNET,
};

export const fetchRoute = (chainId: ChainId, from: string, to: string) =>
  ROUTES[chainId][`${from}-${to}`] ?? reverseRoute(ROUTES[chainId][`${to}-${from}`]);

export const fetchAllRoutes = (chainId: ChainId) => {
  const routes = ROUTES[chainId];
  return reduce(
    (acc: { [x: string]: Pool[] | undefined }, key: string) => ({
      ...acc,
      ...{
        [key]: routes[key],
        [key.split('-').reverse().join('-')]: reverseRoute(routes[key]),
      },
    }),
    {},
    keys(routes) as string[],
  );
};
