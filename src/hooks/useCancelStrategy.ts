import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import * as Sentry from '@sentry/react';
import { Denom } from '@models/Denom';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@hooks/useWallet';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { CANCEL_VAULT_FEE, ONE_MILLION } from 'src/constants';
import { encode } from '@helpers/encode';
import { getFeeMessage } from '@helpers/getFeeMessage';
import { ExecuteMsg } from 'src/interfaces/v2/generated/execute';
import { getChainContractAddress, getChainFeeTakerAddress } from '@helpers/chains';
import { DenomInfo } from '@utils/DenomInfo';
import useFiatPrice from './useFiatPrice';
import { Strategy } from './useStrategies';
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

const useCancelStrategy = (initialDenom: DenomInfo) => {
  const { address, signingClient: client } = useWallet();
  const msgs: EncodeObject[] = [];
  const { price } = useFiatPrice(initialDenom);
  const { chain } = useChain();

  return useMutation<DeliverTxResponse, Error, Strategy>(
    (strategy: Strategy) => {
      if (client == null) {
        throw new Error('no client');
      }

      if (address == null) {
        throw new Error('no address');
      }

      if (chain == null) {
        throw new Error('no chain');
      }

      if (!price) {
        throw new Error('No fiat price information');
      }

      if (address !== strategy.owner) {
        throw new Error('You are not the owner of this strategy');
      }

      msgs.push(getCancelVaultExecuteMsg(strategy.id, address, getChainContractAddress(chain)));
      const tokensToCoverFee = ((CANCEL_VAULT_FEE / price) * ONE_MILLION).toFixed(0);

      msgs.push(getFeeMessage(address, initialDenom.id, tokensToCoverFee, getChainFeeTakerAddress(chain)));

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
