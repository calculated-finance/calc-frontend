// wrap wizard-ui's useWallet in our own hook to add some extra functionality

import { useWallet as useWizardUiWallet } from '@wizard-ui/react';
import { useKujiWallet } from '@components/WalletProvider';
import { useNetwork } from './useNetwork';

export function useWallet() {
  const {
    address,
    connected: wizardConnected,
    client,
    signingClient,
    connecting,
    disconnect,
    wallets,
  } = useWizardUiWallet();

  const kujiWallet = useKujiWallet();
  const [{ query }] = useNetwork();

  if (wizardConnected) {
    return { address, connected: wizardConnected, client, signingClient, connecting, disconnect, wallets };
  }
  if (kujiWallet?.account && query) {
    return {
      address: kujiWallet.account?.address,
      connected: true,
      disconnect: kujiWallet.disconnect,
      signingClient: {
        signAndBroadcast: (senderAddress: string, msgs: any, fee: any, memo: string) =>
          kujiWallet.signAndBroadcast(msgs, memo),
      },
      client: {
        getBalance: query.bank.balance,

        queryContractSmart: query.wasm.queryContractSmart,
      },
    };
  }
  return {};
}
