import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';

export async function signAndBroadcast(client: SigningCosmWasmClient, senderAddress: string, msgs: EncodeObject[]) {
  try {
    // const gas = await client.simulate(senderAddress, msgs, 'memo');
    return await client.signAndBroadcast(senderAddress, msgs, 'auto');
  } catch (error: any) {
    if (error.toString().includes('transaction indexing is disabled')) {
      Sentry.captureException(error, { tags: { page: 'signAndBroadcast' } });
      return Promise.resolve(undefined);
    }
    throw new Error(error);
  }
}
