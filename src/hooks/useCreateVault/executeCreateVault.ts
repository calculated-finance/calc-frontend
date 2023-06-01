import {
  OUT_OF_GAS_ERROR_MESSAGE,
  LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
  TRANSACTION_INDEXING_DISABLED_ERROR_MESSAGE,
} from 'src/constants';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DeliverTxResponse, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Event } from '@cosmjs/stargate/build/events';

function getStrategyIdFromEvents(events: readonly Event[]) {
  return events.find((event) => event.type === 'wasm')?.attributes.find((attribute) => attribute.key === 'vault_id')
    ?.value;
}

export function getVaultIdFromDeliverTxResponse(data: DeliverTxResponse) {
  const { events } = data;
  if (!events) {
    throw new Error('No events');
  }

  const id = getStrategyIdFromEvents(events);

  if (!id) {
    throw new Error('No id found');
  }
  return id;
}

export function executeCreateVault(
  client: SigningCosmWasmClient,
  senderAddress: any,
  msgs: EncodeObject[],
): Promise<string> {
  return client
    .signAndBroadcast(senderAddress, msgs, 'auto')
    .then((data) => {
      try {
        return getVaultIdFromDeliverTxResponse(data);
      } catch (error) {
        throw data.rawLog ? new Error(data.rawLog) : error;
      }
    })
    .catch((error) => {
      const errorMatchers: Record<string, string> = {
        'out of gas': OUT_OF_GAS_ERROR_MESSAGE,
        "Type URL '/cosmos.authz.v1beta1.MsgGrant' does not exist in the Amino message type register":
          LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
        'transaction indexing is disabled': TRANSACTION_INDEXING_DISABLED_ERROR_MESSAGE,
      };

      const matchingErrorKey = Object.keys(errorMatchers).find((key) => error.toString().includes(key));
      throw new Error(matchingErrorKey ? errorMatchers[matchingErrorKey] : error);
    });
}
