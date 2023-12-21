import { DenomInfoWithoutId } from './DenomInfoWithoutId';

export const defaultDenom = {
  name: '',
  icon: '',
  stakeable: false,
  stakeableAndSupported: false,
  stable: false,
  coingeckoId: '',
  enabled: true,
  minimumSwapAmount: 0.05,
  significantFigures: 6,
  enabledInDcaPlus: false,
  pricePrecision: 3,
} as DenomInfoWithoutId;
