import { V2Pair, V3Pair } from '@models/Pair';

export const getBaseDenom = (pair: V2Pair | V3Pair): string => {
  if ('denoms' in pair) {
    return pair.denoms[0];
  }
  return pair.base_denom;
};

export const getQuoteDenom = (pair: V2Pair | V3Pair): string => {
  if ('denoms' in pair) {
    return pair.denoms[1];
  }
  return pair.quote_denom;
};
