import React from 'react';
import { useWallet } from '@wizard-ui/react';
import { truncate } from '@wizard-ui/core';
import { HStack, Box, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useWalletModal } from 'src/hooks/useWalletModal';

function CosmosWallet() {
  const { visible, setVisible } = useWalletModal();
  const { address, disconnect } = useWallet();

  const handleClick = () => {
    setVisible(!visible);
  };

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

  return (
    <Button variant="outline" onClick={handleClick}>
      Connect to a wallet
    </Button>
  );
}

export default CosmosWallet;
