import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { find } from 'rambda';

export function findPair(pairs: Pair[], resultingDenom: DenomInfo, initialDenom: DenomInfo): Pair | undefined {
  const initialAsQuote = find(
    (pair: Pair) => getBaseDenom(pair) === resultingDenom.id && getQuoteDenom(pair) === initialDenom.id,
    pairs,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }

  return find(
    (pair: Pair) => getBaseDenom(pair) === initialDenom.id && getQuoteDenom(pair) === resultingDenom.id,
    pairs,
  );
}
