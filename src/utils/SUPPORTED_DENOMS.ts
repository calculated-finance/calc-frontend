import getDenomInfo from './getDenomInfo';
import { testnetDenoms } from './testnetDenomsKujira';
import { mainnetDenoms } from './mainnetDenomsKujira';

export const SUPPORTED_DENOMS = Object.keys({ ...mainnetDenoms, ...testnetDenoms }).filter(
  (denom) => getDenomInfo(denom).enabled,
);
