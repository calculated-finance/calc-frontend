import { HStack } from '@chakra-ui/react';
import CosmosWallet from '@components/CosmosWallet';
import { useAdmin } from '@hooks/useAdmin';
import { Chains, useChain } from '@hooks/useChain';
import { isMainnet } from '@utils/isMainnet';
import { ChainSelection } from '../ChainSelection';

export function SidebarControls() {
  const { isAdmin } = useAdmin();
  const { chain } = useChain();
  const showChainSelection = !isMainnet() && (chain === Chains.Osmosis || isAdmin);
  return (
    <HStack>
      {showChainSelection && <ChainSelection />}
      <CosmosWallet />
    </HStack>
  );
}
