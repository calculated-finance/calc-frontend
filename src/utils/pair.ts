import { HydratedPair } from '@models/Pair';
import { InitialDenomInfo } from './DenomInfo';

export const getBaseDenom = (pair: HydratedPair): InitialDenomInfo => pair.denoms[0];

export const getQuoteDenom = (pair: HydratedPair): InitialDenomInfo => pair.denoms[1];
