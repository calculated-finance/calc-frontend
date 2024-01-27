import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getChainEndpoint, getGasPrice } from '@helpers/chains';
import { ChainContext } from '@cosmos-kit/core';
import { useChainContext } from './useChainContext';
import { ChainId } from '@models/ChainId';

export function useWallet() {
  const chainContext = useChainContext();

  const getSigningClient = async (context: ChainContext) =>
    SigningCosmWasmClient.connectWithSigner(
      getChainEndpoint(context.chain.chain_id as ChainId),
      context.getOfflineSignerDirect(),
      {
        gasPrice: getGasPrice(context.chain.chain_id as ChainId),
      },
    );

  if (chainContext?.isWalletConnected) {
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
