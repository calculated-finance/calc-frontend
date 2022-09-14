import { WalletReadyState } from '@wizard-ui/core';
import type { Wallet } from '@wizard-ui/react';

import { Center, Spacer, Image } from '@chakra-ui/react';

export interface WalletListItemProps {
  handleClick: () => void;
  wallet: Wallet;
}

export function WalletListItem({ handleClick, wallet }: WalletListItemProps) {
  return (
    <Center
      w="full"
      onClick={handleClick}
      bg="deepHorizon"
      p={2}
      px={3}
      borderRadius="xl"
      borderColor="slateGrey"
      borderWidth={1}
      _hover={{ bg: 'slateGrey', borderColor: 'deepHorizon' }}
      cursor="pointer"
    >
      <Image w={4} mr={2} src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} />
      <div>{wallet.adapter.name}</div>
      <Spacer />
      {wallet.readyState === WalletReadyState.Installed && <p>Installed</p>}
    </Center>
  );
}
