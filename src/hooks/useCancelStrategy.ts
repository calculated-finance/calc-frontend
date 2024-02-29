import { DeliverTxResponse, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWallet } from '@hooks/useWallet';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { encode } from '@helpers/encode';
import { ExecuteMsg } from 'src/interfaces/dca/execute';
import { getChainContractAddress } from '@helpers/chains';
import { Strategy } from '@models/Strategy';
import { useChainId } from '@hooks/useChainId';

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
  const { address, getSigningClient, connected } = useWallet();
  const { chainId } = useChainId();

  const { data: client } = useQuery<SigningCosmWasmClient>(['signingCosmWasmClient', chainId], getSigningClient, {
    enabled: !!chainId && connected,
    staleTime: 1000 * 60 * 10,
  });

  return useMutation<DeliverTxResponse, Error, Strategy>(
    (strategy: Strategy) => {
      if (client == null) {
        throw new Error('no client');
      }

      if (address == null) {
        throw new Error('no address');
      }

      if (chainId == null) {
        throw new Error('no chain');
      }

      if (address !== strategy.owner) {
        throw new Error('You are not the owner of this strategy');
      }

      return client.signAndBroadcast(
        address,
        [getCancelVaultExecuteMsg(strategy.id, address, getChainContractAddress(chainId))],
        'auto',
      );
    },
    {
      onError: (error, strategy) => {
        Sentry.captureException(error, { tags: { chain: chainId, strategy: JSON.stringify(strategy) } });
      },
    },
  );
};

export default useCancelStrategy;
