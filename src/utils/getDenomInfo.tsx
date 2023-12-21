import { DenomInfo } from './DenomInfo';

export const fromAtomic = (denom: DenomInfo, value: number) => value / 10 ** denom.significantFigures;

export const toAtomic = (denom: DenomInfo, value: number) => Math.round(value * 10 ** denom.significantFigures);

export const priceFromRatio = (denom: DenomInfo, value: number | null | undefined) =>
  Number(value) * 10 ** (denom.significantFigures - 6);

export const ratioFromPrice = (denom: DenomInfo, value: number | null | undefined) =>
  Number(value) / 10 ** (denom.significantFigures - 6);

export function getDenomName(denomInfo: DenomInfo) {
  return denomInfo.name;
}

export function isDenomStable(denom: DenomInfo | undefined) {
  return denom?.stable;
}

export function isDenomVolatile(denom: DenomInfo | undefined) {
  return !isDenomStable(denom);
}
