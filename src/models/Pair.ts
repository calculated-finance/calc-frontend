import { Addr } from 'src/interfaces/generated/execute';
import { Denom } from './Denom';

export type Pair = {
  address: Addr;
  base_denom: Denom;
  quote_denom: Denom;
};
