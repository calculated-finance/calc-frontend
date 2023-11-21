import { Button } from '@chakra-ui/react';
import { useCosmosKit } from '@hooks/useCosmosKit';

export function StepOneConnectWallet() {
  const { openView } = useCosmosKit();

  return <Button onClick={openView}>Connect to a wallet</Button>;
}
