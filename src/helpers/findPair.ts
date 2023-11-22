import { V3Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { find } from 'rambda';

export function findPair(pairs: V3Pair[], resultingDenom: DenomInfo, initialDenom: DenomInfo): V3Pair | undefined {
  const initialAsQuote = find(
    (pair: V3Pair) => getBaseDenom(pair) === resultingDenom.id && getQuoteDenom(pair) === initialDenom.id,
    pairs,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }

  return find(
    (pair: V3Pair) => getBaseDenom(pair) === initialDenom.id && getQuoteDenom(pair) === resultingDenom.id,
    pairs,
  );
}
