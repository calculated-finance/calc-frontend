import { OUT_OF_GAS_ERROR_MESSAGE, LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE } from 'src/constants';
import { EncodeObject } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getVaultIdFromDeliverTxResponse } from './index';

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
      const errorMessages: Record<string, string> = {
        'out of gas': OUT_OF_GAS_ERROR_MESSAGE,
        "Type URL '/cosmos.authz.v1beta1.MsgGrant' does not exist in the Amino message type register":
          LEDGER_AUTHZ_NOT_INCLUDED_ERROR_MESSAGE,
      };
      const matchingErrorKey = Object.keys(errorMessages).find((key) => error.toString().includes(key));
      throw new Error(matchingErrorKey ? errorMessages[matchingErrorKey] : error);
    });
}
