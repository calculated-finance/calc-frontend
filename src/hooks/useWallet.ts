import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getGasPrice } from '@helpers/chains';
import { ChainContext } from '@cosmos-kit/core';
import { curry } from 'rambda';
import { useChainContext } from './useChainContext';
import { ChainId } from './useChainId/Chains';

export function useWallet() {
  const chainContext = useChainContext();

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
      getSigningClient: curry(getSigningClient)(chainContext),
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
