import {
  OUT_OF_GAS_ERROR_MESSAGE,
  LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
  TRANSACTION_INDEXING_DISABLED_ERROR_MESSAGE,
} from 'src/constants';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DeliverTxResponse, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Event } from '@cosmjs/stargate/build/events';
import { signAndBroadcast } from '@helpers/api/signAndBroadcast';

function getStrategyIdFromEvents(events: readonly Event[]) {
  return events.find((event) => event.type === 'wasm')?.attributes.find((attribute) => attribute.key === 'vault_id')
    ?.value;
}

export function getVaultIdFromDeliverTxResponse(data: DeliverTxResponse | undefined) {
  const id = data?.events && getStrategyIdFromEvents(data.events);
  return id || undefined;
}

export function executeCreateVault(
  client: SigningCosmWasmClient,
  senderAddress: string,
  msgs: EncodeObject[],
): Promise<string | undefined> {
  return signAndBroadcast(client, senderAddress, msgs)
    .then((data) => {
      try {
        return getVaultIdFromDeliverTxResponse(data);
      } catch (error) {
        const { rawLog } = data || {};
        throw rawLog ? new Error(rawLog) : error;
      }
    })
    .catch((error) => {
      const errorMatchers: Record<string, string> = {
        'out of gas': OUT_OF_GAS_ERROR_MESSAGE,
        'Failed to fetch': 'Something went wrong when submitting, please try again.',
        'insufficient fees': 'Insufficient fees. Please ensure you have enough for the transaction fees and gas.',
        "Type URL '/cosmos.authz.v1beta1.MsgGrant' does not exist in the Amino message type register":
          LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
        'transaction indexing is disabled': TRANSACTION_INDEXING_DISABLED_ERROR_MESSAGE,
      };

      const matchingErrorKey = Object.keys(errorMatchers).find((key) => error.toString().includes(key));
      throw new Error(matchingErrorKey ? errorMatchers[matchingErrorKey] : error);
    });
}
