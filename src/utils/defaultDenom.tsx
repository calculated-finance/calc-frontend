import { DenomInfoWithoutId } from './DenomInfoWithoutId';

export const defaultDenom = {
  name: '',
  icon: '',
  conversion: (value: number) => value / 1000000,
  deconversion: (value: number) => Math.round(value * 1000000),
  stakeable: false,
  stakeableAndSupported: false,
  stable: false,
  coingeckoId: '',
  promotion: undefined,
  enabled: true,
  minimumSwapAmount: 0.05,
  priceDeconversion: (value: number | undefined | null) => Number(value),
  priceConversion: (value: number | undefined | null) => Number(value),
  significantFigures: 6,
  enabledInDcaPlus: false,
  osmosisId: undefined,
  pricePrecision: 3,
} as DenomInfoWithoutId;
