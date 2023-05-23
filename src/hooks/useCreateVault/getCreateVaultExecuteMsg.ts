import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { ExecuteMsg } from 'src/interfaces/v1/generated/execute';
import { ExecuteMsg as ExecutMsgOsmosis } from 'src/interfaces/generated-osmosis/execute';

export function encodeMsg(createVaultExecuteMsg: ExecuteMsg | ExecutMsgOsmosis) {
  const raw = JSON.stringify(createVaultExecuteMsg);
  const textEncoder = new TextEncoder();
  const encoded_msg = textEncoder.encode(raw);
  return encoded_msg;
}

export function getExecuteMsg(
  msg: ExecuteMsg | ExecutMsgOsmosis,
  funds: Coin[] | undefined,
  senderAddress: string,
  contractAddress: string,
): { typeUrl: string; value: MsgExecuteContract } {
  const encoded_msg = encodeMsg(msg);

  const msgExecuteContract = MsgExecuteContract.fromPartial({
    contract: contractAddress,
    funds,
    msg: encoded_msg,
    sender: senderAddress,
  });

  const protobufMsg = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: msgExecuteContract,
  };

  return protobufMsg;
}
