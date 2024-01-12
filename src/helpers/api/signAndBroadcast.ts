import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';

export async function signAndBroadcast(client: SigningCosmWasmClient, senderAddress: string, msgs: EncodeObject[]) {
  try {
    return await client.signAndBroadcast(senderAddress, msgs, 1.6);
  } catch (error: any) {
    if (error.toString().includes('transaction indexing is disabled')) {
      Sentry.captureException(error, { tags: { page: 'signAndBroadcast' } });
      return Promise.resolve(undefined);
    }
    throw new Error(error);
  }
}
