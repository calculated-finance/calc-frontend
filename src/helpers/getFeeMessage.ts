import { coin } from '@cosmjs/proto-signing';
import { DenomInfo } from '@utils/DenomInfo';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';

export function getFeeMessage(
  senderAddress: string,
  denom: DenomInfo,
  amount: string,
  feeTakerAddress: string,
): { typeUrl: string; value: MsgSend | MsgExecuteContract } {
  return denom.isCw20
    ? {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          contract: denom.id,
          msg: new TextEncoder().encode(
            JSON.stringify({
              transfer: {
                recipient: feeTakerAddress,
                amount,
              },
            }),
          ),
          sender: senderAddress,
        }),
      }
    : {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: MsgSend.fromPartial({
          amount: [coin(amount, denom.id)],
          fromAddress: senderAddress,
          toAddress: feeTakerAddress,
        }),
      };
}
