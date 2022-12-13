import getDenomInfo, { isMainnet, mainnetDenoms, testnetDenoms } from './getDenomInfo';

// filter keys that arent enabled 
export const SUPPORTED_DENOMS = Object.keys( isMainnet() ? mainnetDenoms: testnetDenoms).filter((denom) => {
  const { enabled } = getDenomInfo(denom)
  return enabled;
});