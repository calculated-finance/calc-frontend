import { V3Pair } from '@models/Pair';

export const getBaseDenom = (pair: V3Pair): string => pair.denoms[0];

export const getQuoteDenom = (pair: V3Pair): string => pair.denoms[1];
