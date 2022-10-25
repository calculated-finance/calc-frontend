import React from 'react';
import { useWallet } from '@wizard-ui/react';
import { truncate } from '@wizard-ui/core';
import {
  HStack,
  Box,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Popover,
  ButtonGroup,
  Icon,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Stack,
  Divider,
  GridItem,
  Grid,
} from '@chakra-ui/react';
import { FiBell, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useWalletModal } from 'src/hooks/useWalletModal';
import useBalances from '@hooks/useBalances';
import getDenomInfo from '@utils/getDenomInfo';
import { Remove1Icon, SwitchIcon } from '@fusion-icons/react/interface';
import CalcIcon from './Icon';

function SpendableBalances() {
  const { data } = useBalances();
  return (
    <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <Text fontSize="xs" noOfLines={1}>
          Balance
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Text textStyle="body-xs">Asset</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Divider />
      </GridItem>

      {data?.balances.map((balance: any) => {
        const { name, conversion } = getDenomInfo(balance.denom);
        return (
          <>
            <GridItem colSpan={1}>
              <Text fontSize="xs" noOfLines={1}>
                {conversion(balance.amount)}
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text textStyle="body-xs">{name || balance.denom}</Text>
            </GridItem>
          </>
        );
      })}
    </Grid>
  );
}

function CosmosWallet() {
  const { visible, setVisible } = useWalletModal();
  const { address, disconnect } = useWallet();
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleChangeWallet = () => {
    setVisible(true);
    onClose();
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  if (address != null) {
    return (
      <Box>
        <HStack spacing="3">
          <IconButton aria-label="notifications" variant="ghost" icon={<Icon as={FiBell} />} />
          <Popover placement="bottom-start" closeOnBlur={false} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <Button variant="outline" rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}>
                {truncate(address)}
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="deepHorizon" boxShadow="deepHorizon" p={6} borderWidth={0}>
              <Stack spacing={4}>
                <Text textStyle="body-xs" noOfLines={1}>
                  {address}
                </Text>
                <SpendableBalances />
                <Stack>
                  <Button
                    textAlign="left"
                    size="xs"
                    variant="ghost"
                    onClick={handleChangeWallet}
                    leftIcon={<CalcIcon as={SwitchIcon} stroke="brand.200" />}
                  >
                    Change wallet
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={handleDisconnect}
                    leftIcon={<CalcIcon as={Remove1Icon} stroke="brand.200" />}
                  >
                    Disconnect
                  </Button>
                </Stack>
              </Stack>
            </PopoverContent>
          </Popover>
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
