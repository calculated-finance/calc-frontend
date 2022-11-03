import { Denom } from './Denom';

export type Pair = {
  address: string;
  base_denom: Denom;
  quote_denom: Denom;
};
