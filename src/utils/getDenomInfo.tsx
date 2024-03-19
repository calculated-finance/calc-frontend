import BigNumber from 'bignumber.js';
import { DenomInfo } from './DenomInfo';

export const fromAtomic = (denom: DenomInfo, value: number) =>
  new BigNumber(value).dividedBy(BigNumber(10 ** denom.significantFigures)).toNumber();

export const toAtomicBigInt = (denom: DenomInfo, value: bigint) => value * 10n ** BigInt(denom.significantFigures);

export const toAtomicSafe = (denom: DenomInfo, value: number) =>
  new BigNumber(value).multipliedBy(new BigNumber(10).exponentiatedBy(denom.significantFigures)).decimalPlaces(0);

export const toAtomic = (denom: DenomInfo, value: number) => Math.round(value * 10 ** denom.significantFigures);

export const priceFromRatio = (denom: DenomInfo, value: number) =>
  new BigNumber(value).multipliedBy(new BigNumber(10 ** (denom.significantFigures - 6))).toNumber();

export function getDenomName(denomInfo: DenomInfo) {
  return denomInfo.name;
}

export function isDenomStable(denom: DenomInfo | undefined) {
  return denom?.stable;
}

export function isDenomVolatile(denom: DenomInfo | undefined) {
  return !isDenomStable(denom);
}
