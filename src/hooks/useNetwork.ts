import { Context } from "@components/Context";
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient } from 'kujira.js';
import { useContext } from 'react';

export const useNetwork = (): {
  tmClient: Tendermint34Client | null;
  query: KujiraQueryClient | null;
} => {
  const { tmClient, query } = useContext(Context);

  return { tmClient, query };
};
