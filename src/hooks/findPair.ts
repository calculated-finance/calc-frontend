import { Pair } from '../models/Pair';
import { Denom } from '../models/Denom';

export function findPair(positionType: string, pairs: Pair[], resultingDenom: Denom, initialDenom: Denom) {
  return positionType === 'enter'
    ? pairs?.find((pair: Pair) => pair.base_denom === resultingDenom && pair.quote_denom === initialDenom)?.address
    : pairs?.find((pair: Pair) => pair.base_denom === initialDenom && pair.quote_denom === resultingDenom)?.address;
}
