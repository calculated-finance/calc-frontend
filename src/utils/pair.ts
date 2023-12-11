import { Pair } from '@models/Pair';

export const getBaseDenom = (pair: Pair): string => pair.denoms[0];

export const getQuoteDenom = (pair: Pair): string => pair.denoms[1];
