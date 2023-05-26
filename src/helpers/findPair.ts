import { isDenomStable } from '@utils/getDenomInfo';
import { Pair } from '@models/Pair';
import { Denom } from '@models/Denom';

export function findPair(pairs: Pair[], resultingDenom: Denom, initialDenom: Denom): Pair | undefined {
  const initialAsQuote = pairs?.find(
    (pair: Pair) => pair.base_denom === resultingDenom && pair.quote_denom === initialDenom,
  );

  if (initialAsQuote) {
    return initialAsQuote;
  }
  return pairs?.find((pair: Pair) => pair.base_denom === initialDenom && pair.quote_denom === resultingDenom);
}
