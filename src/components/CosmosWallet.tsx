import React from 'react';
import { useWallet } from '@wizard-ui/react';
import { truncate } from '@wizard-ui/core';
import {
  HStack,
  Box,
  Button,
  Text,
  Popover,
  Icon,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Stack,
  Divider,
  GridItem,
  Grid,
  useToast,
  useClipboard,
  useOutsideClick,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useWalletModal } from 'src/hooks/useWalletModal';
import useBalances from '@hooks/useBalances';
import getDenomInfo from '@utils/getDenomInfo';
import { CopytoclipboardIcon, Remove1Icon, SwitchIcon } from '@fusion-icons/react/interface';
import CalcIcon from './Icon';
import TokenBox from './TokenBox';

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
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { onCopy } = useClipboard(address);
  const ref = React.createRef<HTMLElement>();
  useOutsideClick({
    ref,
    handler: onClose,
  });

  const toast = useToast();

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

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Wallet address copied to clipboard',
      position: 'top',
      status: 'success',
      duration: 9000,
      isClosable: true,
      variant: 'subtle',
    });
    onClose();
  };

  return (
    <Box>
      <HStack spacing="3">
        <TokenBox />
        {address != null ? (
          <Popover placement="bottom-start" closeOnBlur={false} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <Button variant="outline" rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}>
                {truncate(address)}
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="deepHorizon" boxShadow="deepHorizon" p={6} borderWidth={0} w={270}>
              <Stack spacing={4}>
                <Button
                  size="xs"
                  onClick={handleCopy}
                  variant="ghost"
                  colorScheme="white"
                  leftIcon={<CalcIcon as={CopytoclipboardIcon} stroke="brand.200" />}
                >
                  <Box as="span" noOfLines={1}>
                    {address}
                  </Box>
                  <Box as="span">...</Box>
                </Button>
                <SpendableBalances />
                <Stack>
                  <Button
                    w="min-content"
                    size="xs"
                    variant="link"
                    onClick={handleChangeWallet}
                    leftIcon={<CalcIcon as={SwitchIcon} stroke="brand.200" />}
                  >
                    Change wallet
                  </Button>
                  <Button
                    size="xs"
                    w="min-content"
                    variant="link"
                    onClick={handleDisconnect}
                    leftIcon={<CalcIcon as={Remove1Icon} stroke="brand.200" />}
                  >
                    Disconnect
                  </Button>
                </Stack>
              </Stack>
            </PopoverContent>
          </Popover>
        ) : (
          <Button variant="outline" onClick={handleClick}>
            Connect to a wallet
          </Button>
        )}
      </HStack>
    </Box>
  );
}

export default CosmosWallet;
