// wrap wizard-ui's useWallet in our own hook to add some extra functionality

import { useWallet as useWizardUiWallet } from '@wizard-ui/react';

export function useWallet() {
  const { address, connected, client, signingClient, connecting, disconnect, wallets } = useWizardUiWallet();

  return { address, connected, client, signingClient, connecting, disconnect, wallets };
}
