import { useCosmosKit } from './useCosmosKit';
import { useChain } from './useChain';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
  LEAP = 'Leap',
  METAMASK_SNAP = 'Metamask Snap',
  XDEFI = 'XDEFI',
  METAMASK = 'Metamask',
}

export function useWallet() {
  const chain = useChain();
  const cosmosKit = useCosmosKit(chain.chainConfig?.name);

  if (cosmosKit?.isWalletConnected) {
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
    getSigningClient: () => Promise.resolve(null),
    disconnect: undefined,
    walletType: undefined,
    isConnecting: true,
  };
}
