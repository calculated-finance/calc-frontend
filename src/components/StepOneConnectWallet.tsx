import { Button } from '@chakra-ui/react';
import { useChainContext } from '@hooks/useChainContext';

export function ConnectWalletButton() {
  const chainContext = useChainContext();

  return <Button onClick={chainContext?.openView}>Connect to a wallet</Button>;
}
