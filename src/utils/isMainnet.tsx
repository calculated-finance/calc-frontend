import { NETWORK } from 'kujira.js/lib/cjs/network';
import { CHAIN_ID } from 'src/constants';

export function isMainnet() {
  return (CHAIN_ID as NETWORK) === 'kaiyo-1';
}
