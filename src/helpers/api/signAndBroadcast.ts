import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';

export function signAndBroadcast(client: SigningCosmWasmClient, senderAddress: string, msgs: EncodeObject[]) {
  return client.signAndBroadcast(senderAddress, msgs, 'auto').catch((error) => {
    if (error.toString().includes('transaction indexing is disabled')) {
      Sentry.captureException(error);
      return Promise.resolve(undefined);
    }
    throw new Error(error);
  });
}
