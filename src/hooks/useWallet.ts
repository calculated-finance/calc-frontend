import { useChainContext } from './useChainContext';

export function useWallet() {
  const chainContext = useChainContext();

  if (chainContext && chainContext.isWalletConnected) {
    return {
      walletType: chainContext.wallet?.prettyName,
      connected: chainContext.isWalletConnected,
      getSigningClient: chainContext.getSigningCosmWasmClient,
      isConnecting: chainContext.isWalletConnecting,
      ...chainContext,
    };
  }

  return {
    walletType: undefined,
    address: undefined,
    connected: false,
    isConnecting: false,
    disconnect: undefined,
    getSigningClient: () => {
      throw new Error('Wallet is not connected');
    },
  };
}
