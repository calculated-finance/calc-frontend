import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getGasPrice } from '@helpers/chains';
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

  const getSigningClient = async (context: ChainContext, chainId: ChainId) =>
    SigningCosmWasmClient.connectWithSigner(
      await context.getRpcEndpoint(process.env.NEXT_PUBLIC_APP_ENV !== 'production'),
      context.getOfflineSignerAmino(),
      {
        gasPrice: getGasPrice(chainId),
      },
    );

  if (chainContext && chainContext.isWalletConnected) {
    return {
      connected: chainContext.isWalletConnected,
      getSigningClient: (chainId: ChainId) => getSigningClient(chainContext, chainId),
      walletType: chainContext.wallet?.prettyName,
      isConnecting: chainContext.isWalletConnecting,
      ...chainContext,
    };
  }

  return {
    address: undefined,
    connected: false,
    getSigningClient: null,
    disconnect: undefined,
    walletType: undefined,
    isConnecting: false,
  };
}
