import { HydratedPair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';
import { getBaseDenom, getQuoteDenom } from '@utils/pair';
import { find } from 'rambda';

export function findPair(
  pairs: HydratedPair[],
  resultingDenom: DenomInfo,
  initialDenom: DenomInfo,
): HydratedPair | undefined {
  const initialAsQuote = find(
    (pair: HydratedPair) => getBaseDenom(pair).id === resultingDenom.id && getQuoteDenom(pair).id === initialDenom.id,
    pairs,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }

  return find(
    (pair: HydratedPair) => getBaseDenom(pair).id === initialDenom.id && getQuoteDenom(pair).id === resultingDenom.id,
    pairs,
  );
}
