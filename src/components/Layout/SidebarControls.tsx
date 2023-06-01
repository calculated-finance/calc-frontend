import { HStack } from '@chakra-ui/react';
import CosmosWallet from '@components/CosmosWallet';
import { ChainSelection } from '../ChainSelection';

export function SidebarControls() {
  return (
    <HStack>
      <ChainSelection />
      <CosmosWallet />
    </HStack>
  );
}
