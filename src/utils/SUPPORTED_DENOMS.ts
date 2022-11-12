import { isMainnet, mainnetDenoms, testnetDenoms } from './getDenomInfo';


export const SUPPORTED_DENOMS = isMainnet() ? Object.keys(mainnetDenoms) : Object.keys(testnetDenoms);
