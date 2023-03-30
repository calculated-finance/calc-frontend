import { WalletReadyState } from '@wizard-ui/core';
import type { Wallet } from '@wizard-ui/react';

import { Center, Spacer, Image, Box, Button } from '@chakra-ui/react';

export interface WalletListItemProps {
  handleClick: () => void;
  wallet: Wallet;
  walletInstallLink: string;
}

export function WalletListItem({ handleClick, wallet, walletInstallLink }: WalletListItemProps) {
  const isInstalled = wallet.readyState === WalletReadyState.Installed;

  return (
    <Center
      as={isInstalled ? undefined : 'a'}
      onClick={isInstalled ? handleClick : undefined}
      w="full"
      bg="deepHorizon"
      p={2}
      px={3}
      borderRadius="xl"
      borderColor="slateGrey"
      borderWidth={1}
      _hover={{ bg: 'abyss.200' }}
      cursor="pointer"
      href={walletInstallLink}
      target={isInstalled ? undefined : '_blank'}
      rel={isInstalled ? undefined : 'noopener noreferrer'}
    >
      <Image w={4} mr={2} src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} />
      <div>{wallet.adapter.name}</div>
      <Spacer />
      <p>{isInstalled ? 'Installed' : 'Click to install'}</p>
    </Center>
  );
}
