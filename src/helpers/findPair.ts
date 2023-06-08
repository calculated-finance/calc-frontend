import { Pair } from '@models/Pair';
import { DenomInfo } from '@utils/DenomInfo';

export function findPair(pairs: Pair[], resultingDenom: DenomInfo, initialDenom: DenomInfo): Pair | undefined {
  const initialAsQuote = pairs?.find(
    (pair: Pair) => pair.base_denom === resultingDenom.id && pair.quote_denom === initialDenom.id,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }
  return pairs?.find((pair: Pair) => pair.base_denom === initialDenom.id && pair.quote_denom === resultingDenom.id);
}
