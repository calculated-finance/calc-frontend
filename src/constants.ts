import { NETWORK } from 'kujira.js';

// eslint-disable-next-line import/prefer-default-export
export const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || 'kujira18g945dfs4jp8zfu428zfkjz0r4sasnxnsnye5m6dznvmgrlcecpsyrwp7c';
export const STAKING_ROUTER_CONTRACT_ADDRESS =
  process.env.STAKING_ROUTER_CONTRACT_ADDRESS || 'kujira1n2jm3jrjzztjvdljwh549m8zx6w5v59svvta5kkysf5znr40af8qu0vpca';
export const REST_ENDPOINT = process.env.REST_ENDPOINT || 'https://lcd.harpoon.kujira.setten.io';
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://rpc.harpoon.kujira.setten.io';
export const CHAIN_ID = (process.env.CHAIN_ID as NETWORK) || 'harpoon-4';
