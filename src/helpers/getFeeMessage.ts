import { coin } from '@cosmjs/proto-signing';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { msg } from 'kujira.js';

export function getFeeMessage(
  senderAddress: string,
  denom: string,
  amount: string,
  feeTakerAddress: string,
): { typeUrl: string; value: MsgSend } {
  const result = msg.bank.msgSend({
    amount: [coin(amount, denom)],
    fromAddress: senderAddress,
    toAddress: feeTakerAddress,
  });
  return result;
}
