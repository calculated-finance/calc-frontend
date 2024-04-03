import { Pair as GeneratedPair } from 'src/interfaces/dca/response/get_pairs';
import { InitialDenomInfo } from '@utils/DenomInfo';

export type Pair = GeneratedPair;

export type HydratedPair = {
  denoms: [InitialDenomInfo, InitialDenomInfo];
};
