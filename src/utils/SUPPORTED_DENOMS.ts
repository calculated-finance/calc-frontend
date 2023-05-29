import getDenomInfo, { mainnetDenoms, testnetDenoms } from './getDenomInfo';
import { isMainnet } from './isMainnet';

// filter keys that arent enabled
export const SUPPORTED_DENOMS = Object.keys(isMainnet() ? mainnetDenoms : testnetDenoms).filter((denom) => {
  const { enabled } = getDenomInfo(denom);
  return enabled;
});
