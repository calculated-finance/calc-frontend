import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';

export function findPair(pairs: Pair[], resultingDenom: DenomInfo, initialDenom: DenomInfo): Pair | undefined {
  const initialAsQuote = pairs?.find(
    (pair: Pair) => pair.denoms[0] === resultingDenom.id && pair.denoms[1] === initialDenom.id,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }
  return pairs?.find((pair: Pair) => pair.denoms[0] === initialDenom.id && pair.denoms[1] === resultingDenom.id);
}
