import { coin } from "@cosmjs/proto-signing"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"
import { msg } from "kujira.js"
import { FEE_TAKER_ADDRESS } from "src/constants"
  
export function getFeeMessage(senderAddress: string, denom: string, amount: string): 
    { typeUrl: string, value: MsgSend } {

    return msg.bank.msgSend({
        amount: [coin(amount, denom)],
        fromAddress: senderAddress,
        toAddress: FEE_TAKER_ADDRESS
    })
}