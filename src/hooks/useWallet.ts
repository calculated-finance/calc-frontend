import { useCosmosKit } from './useCosmosKit';
import { useChainId } from './useChain';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
  LEAP = 'Leap',
  METAMASK_SNAP = 'Metamask Snap',
  XDEFI = 'XDEFI',
  METAMASK = 'Metamask',
}

export function useWallet() {
  const { chainId } = useChainId();
  const cosmosKit = useCosmosKit(chainId);

  if (cosmosKit && cosmosKit.isWalletConnected) {
    return {
      address: cosmosKit.address,
      connected: cosmosKit.isWalletConnected,
      getSigningClient: cosmosKit.getSigningCosmWasmClient,
      disconnect: cosmosKit.disconnect,
      walletType: cosmosKit.wallet?.prettyName,
      isConnecting: cosmosKit.isWalletConnecting,
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
