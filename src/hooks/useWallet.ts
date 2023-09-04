import { featureFlags } from 'src/constants';
import { useMemo } from 'react';
import { useKeplr } from './useKeplr';
import { useLeap } from './useLeap';
import { useXDEFI } from './useXDEFI';
import { useMetamask } from './useMetamask';
import { useCosmosKit } from './useCosmosKit';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
  LEAP = 'Leap',
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

  const cosmosKit = useCosmosKit();

  if (featureFlags.cosmoskitEnabled) {
    if (!cosmosKit) {
      return {};
    }
    if (cosmosKit.isWalletConnected) {
      return {
        address: cosmosKit.address,
        connected: cosmosKit.isWalletConnected,
        getSigningClient: cosmosKit.getCosmWasmClient,
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

  return {
    address: undefined,
    connected: false,
    getSigningClient: () => () => Promise.resolve(null),
    disconnect: undefined,
    walletType: undefined,
    isConnecting:
      keplrWallet.isConnecting || leapWallet?.isConnecting || XDEFIWallet?.isConnecting || metamaskWallet?.isConnecting,
  };
}
