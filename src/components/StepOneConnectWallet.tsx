import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@hooks/useWalletModal';

export function StepOneConnectWallet() {
  const { setVisible } = useWalletModal();

  return <Button onClick={() => setVisible(true)}>Connect to a wallet</Button>;
}
