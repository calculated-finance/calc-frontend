import { useKeplr } from './useKeplr';
import { useLeap } from './useLeap';
import { useXDEFI } from './useXDEFI';
import { useMetamask } from './useMetamask';
import { useMetamaskSnap } from './useMetamaskSnap';
import { useCosmosKit } from './useCosmosKit';
import { featureFlags } from 'src/constants';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
  LEAP = 'Leap',
  METAMASK_SNAP = 'Metamask Snap',
  XDEFI = 'XDEFI',
  METAMASK = 'Metamask',
}

export function useWallet() {
  const keplrWallet = useKeplr((state) => ({
    account: state.account,
    controller: state.controller,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  const leapWallet = useLeap((state) => ({
    account: state.account,
    controller: state.controller,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  const leapSnapWallet = useMetamaskSnap((state) => ({
    account: state.account,
    controller: state.controller,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  const XDEFIWallet = useXDEFI((state) => ({
    account: state.account,
    controller: state.controller,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  const metamaskWallet = useMetamask((state: any) => ({
    account: state.account,
    isConnecting: state.isConnecting,
    disconnect: state.disconnect,
  }));

  // const stationWallet = useStation((state) => ({
  //   account: state.account,
  //   disconnect: state.disconnect,
  //   signAndBroadcast: state.signAndBroadcast,
  //   isConnecting: state.isConnecting,
  // }));

  const cosmosKit = useCosmosKit();

  if (featureFlags.cosmoskitEnabled) {
    if (!cosmosKit) {
      return {};
    }
    if (cosmosKit.isWalletConnected) {
      return {
        address: cosmosKit.address,
        connected: cosmosKit.isWalletConnected,
        getSigningClient: cosmosKit.getSigningCosmWasmClient,
        disconnect: cosmosKit.disconnect,
        walletType: cosmosKit.wallet?.prettyName,
        isConnecting: cosmosKit.isWalletConnecting,
      };
    }
  }

  if (metamaskWallet.account) {
    return {
      address: metamaskWallet.account?.address,
      connected: true,
      getSigningClient: null,
      disconnect: metamaskWallet.disconnect,
      walletType: WalletTypes.METAMASK,
      isConnecting: false,
    };
  }

  if (keplrWallet.account) {
    return {
      address: keplrWallet.account?.address,
      connected: true,
      getSigningClient: () => Promise.resolve(keplrWallet.controller),
      disconnect: keplrWallet.disconnect,
      walletType: WalletTypes.KEPLR,
      isConnecting: false,
    };
  }
  if (leapWallet.account) {
    return {
      address: leapWallet.account?.address,
      connected: true,
      getSigningClient: () => Promise.resolve(leapWallet.controller),
      disconnect: leapWallet.disconnect,
      walletType: WalletTypes.LEAP,
      isConnecting: false,
    };
  }

  if (leapSnapWallet.account) {
    return {
      address: leapSnapWallet.account?.address,
      connected: true,
      getSigningClient: () => Promise.resolve(leapSnapWallet.controller),
      disconnect: leapSnapWallet.disconnect,
      walletType: WalletTypes.METAMASK_SNAP,
      isConnecting: false,
    };
  }

  if (XDEFIWallet.account) {
    return {
      address: XDEFIWallet.account?.address,
      connected: true,
      getSigningClient: () => Promise.resolve(XDEFIWallet.controller),
      disconnect: XDEFIWallet.disconnect,
      walletType: WalletTypes.XDEFI,
      isConnecting: false,
    };
  }
  // if (stationWallet?.account) {
  //   return {
  //     address: stationWallet.account?.address,
  //     connected: true,
  //     disconnect: stationWallet.disconnect,
  //     signingClient: {
  //       signAndBroadcast: (
  //         senderAddress: string,
  //         msgs: EncodeObject[],
  //         fee: number | StdFee | 'auto',
  //         memo?: string | undefined,
  //       ) => stationWallet.signAndBroadcast(msgs),
  //     } as SigningCosmWasmClient,
  //     walletType: WalletTypes.STATION,
  //     isConnecting: false,
  //   };
  // }
  return {
    address: undefined,
    connected: false,
    getSigningClient: () => Promise.resolve(null),
    disconnect: undefined,
    walletType: undefined,
    isConnecting:
      keplrWallet.isConnecting || leapWallet?.isConnecting || XDEFIWallet?.isConnecting || metamaskWallet?.isConnecting,
  };
}
