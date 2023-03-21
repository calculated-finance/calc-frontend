import getDenomInfo, { mainnetDenoms, testnetDenoms } from './getDenomInfo';
import { isMainnet } from './isMainnet';

// filter keys that arent enabled
export const SUPPORTED_DENOMS = Object.keys(isMainnet() ? mainnetDenoms : testnetDenoms).filter((denom) => {
  const { enabled } = getDenomInfo(denom);
  return enabled;
});

export const SUPPORTED_DENOMS_FOR_DCA_PLUS = Object.keys(isMainnet() ? mainnetDenoms : testnetDenoms).filter(
  (denom) => {
    const { enabledInDcaPlus } = getDenomInfo(denom);
    return enabledInDcaPlus;
  },
);
