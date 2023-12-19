import { Pair as GeneratedPair } from 'src/interfaces/v2/generated/response/get_pairs';
import { DenomInfo } from '@utils/DenomInfo';

export type Pair = GeneratedPair;

export type HydratedPair = {
  denoms: [DenomInfo, DenomInfo];
};
