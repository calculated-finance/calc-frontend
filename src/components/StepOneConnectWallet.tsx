import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@hooks/useWalletModal';

export function StepOneConnectWallet() {
  const { setVisible } = useWalletModal();
  const handleConnect = () => {
    setVisible(true);
  };

  return <Button onClick={handleConnect}>Connect to a wallet</Button>;
}
