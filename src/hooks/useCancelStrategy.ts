import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { Denom } from '@models/Denom';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@wizard-ui/react';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { CANCEL_VAULT_FEE, CONTRACT_ADDRESS, ONE_MILLION } from 'src/constants';
import { encode } from '@helpers/encode';
import { getFeeMessage } from '@helpers/getFeeMessage';
import { ExecuteMsg } from 'src/interfaces/generated/execute';
import useFiatPrice from './useFiatPrice';
import { Strategy } from './useStrategies';

function getCancelVaultExecuteMsg(strategyId: Strategy['id'], senderAddress: string): EncodeObject {
  const msg = {
    cancel_vault: {
      vault_id: strategyId,
    },
  } as ExecuteMsg;

  const encoded_msg = encode(msg);

  const msgExecuteContract = MsgExecuteContract.fromPartial({
    contract: CONTRACT_ADDRESS,
    msg: encoded_msg,
    sender: senderAddress,
  });

  const protobufMsg = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: msgExecuteContract,
  };

  return protobufMsg;
}

const useCancelStrategy = (initialDenom: Denom) => {
  const { address, signingClient: client } = useWallet();
  const msgs: EncodeObject[] = [];
  const { price } = useFiatPrice(initialDenom);

  return useMutation<DeliverTxResponse, Error, Strategy['id']>((strategyId: Strategy['id']) => {
    if (client == null) {
      throw new Error('no client');
    }

    if (address == null) {
      throw new Error('no address');
    }

    if (!price) {
      throw new Error('No fiat price information');
    }

    msgs.push(getCancelVaultExecuteMsg(strategyId, address));
    const tokensToCoverFee = ((CANCEL_VAULT_FEE / price) * ONE_MILLION).toFixed(0);

    msgs.push(getFeeMessage(address, initialDenom, tokensToCoverFee));

    return client.signAndBroadcast(address, msgs, 'auto');
  });
};

export default useCancelStrategy;
