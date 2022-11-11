import { NETWORK } from 'kujira.js';

// Environment specific constants
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c';
export const STAKING_ROUTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_ROUTER_CONTRACT_ADDRESS ||
  'kujira1n2jm3jrjzztjvdljwh549m8zx6w5v59svvta5kkysf5znr40af8qu0vpca';
export const REST_ENDPOINT = process.env.NEXT_PUBLIC_REST_ENDPOINT || 'https://lcd.harpoon.kujira.setten.io';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.harpoon.kujira.setten.io';
export const CHAIN_ID = (process.env.NEXT_PUBLIC_CHAIN_ID as NETWORK) || 'harpoon-4';
export const FEE_TAKER_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_TAKER_ADDRESS || 'kujira1tn65m5uet32563jj3e2j3wxshht960znv64en0';

// Generic constants (not environment specific)
export const CREATE_VAULT_FEE = 0.3;
export const ONE_MILLION = 1000000;
export const COINGECKO_ENDPOINT = 'https://api.coingecko.com/api/v3';
