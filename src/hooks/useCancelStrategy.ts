import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@hooks/useWallet';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { encode } from '@helpers/encode';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { getChainContractAddress } from '@helpers/chains';
import { Strategy } from '../models/Strategy';
import { useChain } from './useChain';

function getCancelVaultExecuteMsg(
  strategyId: Strategy['id'],
  senderAddress: string,
  contractAddress: string,
): EncodeObject {
  const msg = {
    cancel_vault: {
      vault_id: strategyId,
    },
  } as ExecuteMsg;

  const encoded_msg = encode(msg);

  const msgExecuteContract = MsgExecuteContract.fromPartial({
    contract: contractAddress,
    msg: encoded_msg,
    sender: senderAddress,
  });

  const protobufMsg = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: msgExecuteContract,
  };

  return protobufMsg;
}

const useCancelStrategy = () => {
  const { address, getSigningClient } = useWallet();
  const msgs: EncodeObject[] = [];
  const { chain } = useChain();

  return useMutation<DeliverTxResponse, Error, Strategy>(
    async (strategy: Strategy) => {
      const client = await getSigningClient();
      if (client == null) {
        throw new Error('no client');
      }

      if (address == null) {
        throw new Error('no address');
      }

      if (chain == null) {
        throw new Error('no chain');
      }

      if (address !== strategy.owner) {
        throw new Error('You are not the owner of this strategy');
      }

      msgs.push(getCancelVaultExecuteMsg(strategy.id, address, getChainContractAddress(chain)));

      return client.signAndBroadcast(address, msgs, 'auto');
    },
    {
      onError: (error, strategy) => {
        Sentry.captureException(error, { tags: { chain, strategy: JSON.stringify(strategy) } });
      },
    },
  );
};

export default useCancelStrategy;
