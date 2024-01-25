import { HStack } from '@chakra-ui/react';
import CosmosWallet from '@components/CosmosWallet';
import { ChainSelection } from './ChainSelection';

export function AppHeaderActions() {
  return (
    <HStack>
      <ChainSelection />
      <CosmosWallet />
    </HStack>
  );
}
