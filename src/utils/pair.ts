import { HydratedPair } from '@models/Pair';
import { DenomInfo } from './DenomInfo';

export const getBaseDenom = (pair: HydratedPair): DenomInfo => pair.denoms[0];

export const getQuoteDenom = (pair: HydratedPair): DenomInfo => pair.denoms[1];
