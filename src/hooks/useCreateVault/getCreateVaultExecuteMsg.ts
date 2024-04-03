import { toBase64 } from '@helpers/base64';
import { InitialDenomInfo } from '@utils/DenomInfo';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { ExecuteMsg } from 'src/interfaces/dca/execute';

export function getExecuteMsg(
  msg: ExecuteMsg,
  funds: Coin[] | undefined,
  senderAddress: string,
  contractAddress: string,
  initialDenom: InitialDenomInfo,
): { typeUrl: string; value: MsgExecuteContract } {
  const encodedMsg = new TextEncoder().encode(JSON.stringify(msg));
  return initialDenom.isCw20 && funds
    ? {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          contract: initialDenom.id,
          msg: new TextEncoder().encode(
            JSON.stringify({
              send: {
                contract: contractAddress,
                amount: funds![0].amount,
                msg: toBase64(msg),
              },
            }),
          ),
          sender: senderAddress,
        }),
      }
    : {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          contract: contractAddress,
          funds,
          msg: encodedMsg,
          sender: senderAddress,
        }),
      };
}
