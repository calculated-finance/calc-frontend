import { DenomInfoWithoutId } from './DenomInfoWithoutId';

export const defaultDenom = {
  name: '',
  icon: '',
  fromAtomic: (value: number) => value / 1000000,
  toAtomic: (value: number) => Math.round(value * 1000000),
  stakeable: false,
  stakeableAndSupported: false,
  stable: false,
  coingeckoId: '',
  enabled: true,
  minimumSwapAmount: 0.05,
  priceFromRatio: (value: number | undefined | null) => Number(value),
  ratioFromPrice: (value: number | undefined | null) => Number(value),
  significantFigures: 6,
  enabledInDcaPlus: false,
  pricePrecision: 3,
} as DenomInfoWithoutId;
