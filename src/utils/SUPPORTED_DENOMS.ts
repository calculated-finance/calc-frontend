import getDenomInfo from './getDenomInfo';
import { testnetDenoms } from './testnetDenoms';
import { mainnetDenoms } from './mainnetDenoms';
import { isMainnet } from './isMainnet';

// filter keys that arent enabled
export const SUPPORTED_DENOMS = Object.keys(isMainnet() ? mainnetDenoms : testnetDenoms).filter((denom) => {
  const { enabled } = getDenomInfo(denom);
  return enabled;
});
