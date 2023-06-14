import { V2Pair, V3Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { find } from 'rambda';

export function findPair(
  pairs: V2Pair[] | V3Pair[],
  resultingDenom: DenomInfo,
  initialDenom: DenomInfo,
): V3Pair | V2Pair | undefined {
  const initialAsQuote = find(
    (pair: V2Pair | V3Pair) => getBaseDenom(pair) === resultingDenom.id && getQuoteDenom(pair) === initialDenom.id,
    pairs,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }

  return find(
    (pair: V2Pair | V3Pair) => getBaseDenom(pair) === initialDenom.id && getQuoteDenom(pair) === resultingDenom.id,
    pairs,
  );
}
