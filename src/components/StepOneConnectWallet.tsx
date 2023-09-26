import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@hooks/useWalletModal';

export function StepOneConnectWallet() {
  const { setVisible } = useWalletModal();
  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <Button w="full" onClick={handleConnect}>
      Connect to a wallet
    </Button>
  );
}
