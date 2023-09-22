import { useKeplr } from './useKeplr';
import { useLeap } from './useLeap';
import { useXDEFI } from './useXDEFI';
import { useMetamask } from './useMetamask';
import { useMetamaskSnap } from './useMetamaskSnap';

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

  const metamaskWallet = useMetamask((state) => ({
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
  if (metamaskWallet.account) {
    return {
      address: metamaskWallet.account?.address,
      connected: true,
      signingClient: null,
      disconnect: metamaskWallet.disconnect,
      walletType: WalletTypes.METAMASK,
      isConnecting: false,
    };
  }

  if (keplrWallet.account) {
    return {
      address: keplrWallet.account?.address,
      connected: true,
      signingClient: keplrWallet.controller,
      disconnect: keplrWallet.disconnect,
      walletType: WalletTypes.KEPLR,
      isConnecting: false,
    };
  }
  if (leapWallet.account) {
    return {
      address: leapWallet.account?.address,
      connected: true,
      signingClient: leapWallet.controller,
      disconnect: leapWallet.disconnect,
      walletType: WalletTypes.LEAP,
      isConnecting: false,
    };
  }

  if (leapSnapWallet.account) {
    return {
      address: leapSnapWallet.account?.address,
      connected: true,
      signingClient: leapSnapWallet.controller,
      disconnect: leapSnapWallet.disconnect,
      walletType: WalletTypes.METAMASK_SNAP,
      isConnecting: false,
    };
  }

  if (XDEFIWallet.account) {
    return {
      address: XDEFIWallet.account?.address,
      connected: true,
      signingClient: XDEFIWallet.controller,
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
    isConnecting:
      keplrWallet.isConnecting ||
      leapWallet?.isConnecting ||
      XDEFIWallet?.isConnecting ||
      metamaskWallet?.isConnecting ||
      leapSnapWallet?.isConnecting,
  };
}
