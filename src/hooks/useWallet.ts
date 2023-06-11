import { useStation } from '@hooks/useStation';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/stargate';
import { useKeplr } from './useKeplr';
import { useLeap } from './useLeap';
import { useXDEFI } from './useXDEFI';

export enum WalletTypes {
  KEPLR = 'Keplr',
  STATION = 'Station',
  LEAP = 'Leap',
  XDEFI = 'XDEFI',
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

  const stationWallet = useStation((state) => ({
    account: state.account,
    disconnect: state.disconnect,
    signAndBroadcast: state.signAndBroadcast,
    isConnecting: state.isConnecting,
  }));

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
  if (stationWallet?.account) {
    return {
      address: stationWallet.account?.address,
      connected: true,
      disconnect: stationWallet.disconnect,
      signingClient: {
        signAndBroadcast: (
          senderAddress: string,
          msgs: EncodeObject[],
          fee: number | StdFee | 'auto',
          memo?: string | undefined,
        ) => stationWallet.signAndBroadcast(msgs),
      } as SigningCosmWasmClient,
      walletType: WalletTypes.STATION,
      isConnecting: false,
    };
  }
  return {
    isConnecting: keplrWallet.isConnecting || stationWallet?.isConnecting || leapWallet?.isConnecting,
  };
}
