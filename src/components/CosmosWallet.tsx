import React from 'react';
import { useWallet, useWalletModal, WalletModalButton } from '@wizard-ui/react';
import { truncate } from '@wizard-ui/core';
import { HStack, Box, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';

export function CosmosWallet() {
  const { setVisible } = useWalletModal();
  const { address, disconnect } = useWallet();

  if (address != null) {
    return (
      <Box>
        <HStack spacing="3">
          <IconButton aria-label="notifications" variant="ghost" icon={<Icon as={FiBell} />} />
          <Menu placement="bottom-end">
            <MenuButton as={Button} variant="outline" rightIcon={<Icon as={FiChevronDown} />}>
              {truncate(address)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setVisible(true)}>Change wallet</MenuItem>
              <MenuItem onClick={disconnect}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  return <WalletModalButton variant="outline">Connect to a wallet</WalletModalButton>;
}

export default CosmosWallet;
