import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainInfo, getGasPrice } from '@helpers/chains';
import { ChainContext } from '@cosmos-kit/core';
import { useEffect } from 'react';
import { useChainContext } from './useChainContext';
import { ChainId } from './useChainId/Chains';

export function useWallet() {
  const chainContext = useChainContext();

  useEffect(() => {
    if (
      !chainContext?.isWalletDisconnected &&
      !chainContext?.isWalletConnected &&
      !chainContext?.isWalletConnecting &&
      chainContext?.wallet
    ) {
      chainContext.disconnect();
    }
  }, [
    chainContext?.isWalletDisconnected,
    chainContext?.isWalletConnected,
    chainContext?.isWalletConnecting,
    chainContext?.isWalletDisconnected,
    chainContext?.wallet,
  ]);

  const getSigningClient = async (context: ChainContext) =>
    SigningCosmWasmClient.connectWithSigner(
      getChainInfo(context.chain.chain_id as ChainId).rpc,
      context.getOfflineSignerAmino(),
      {
        gasPrice: getGasPrice(context.chain.chain_id as ChainId),
      },
    );

  if (chainContext && chainContext.isWalletConnected) {
    return {
      connected: chainContext.isWalletConnected,
      getSigningClient: () => getSigningClient(chainContext),
      walletType: chainContext.wallet?.prettyName,
      isConnecting: chainContext.isWalletConnecting,
      ...chainContext,
    };
  }

  return {
    address: undefined,
    connected: false,
    getSigningClient: () => {
      throw new Error('Attempting to get signing client while not connected');
    },
    disconnect: undefined,
    walletType: undefined,
    isConnecting: false,
  };
}
