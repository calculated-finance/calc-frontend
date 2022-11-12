import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient } from 'kujira.js';


export type NetworkContextProps = {
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
};
