import React from 'react';
import { useWallet } from '@hooks/useWallet';
import {
  HStack,
  Box,
  Button,
  Popover,
  Icon,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Stack,
  useToast,
  useClipboard,
  useOutsideClick,
  Image,
  Divider,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useWalletModal } from 'src/hooks/useWalletModal';
import { CopytoclipboardIcon, Remove1Icon } from '@fusion-icons/react/interface';
import { featureFlags } from 'src/constants';
import CalcIcon from './Icon';
import { SpendableBalances } from './SpendableBalances';
import OnRampModal from './OnRampModalContent';
import SquidModal from './SquidModal';

export function truncate(str: string | null) {
  if (str == null) {
    throw new Error('truncate: String is null');
  }

  return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
}

function CosmosWallet() {
  const { visible, setVisible } = useWalletModal();
  const { address, disconnect, walletType } = useWallet();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isOnRampOpen, onClose: onOnRampClose, onOpen: onOnRampOpen } = useDisclosure();
  const { isOpen: isSquidOpen, onClose: onSquidClose, onOpen: onSquidOpen } = useDisclosure();
  const { onCopy } = useClipboard(address || '');
  const ref = React.createRef<HTMLElement>();
  useOutsideClick({
    ref,
    handler: onClose,
  });

  const toast = useToast();

  const handleClick = () => {
    setVisible(!visible);
  };

  const handleDisconnect = () => {
    disconnect?.();
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
                <Button
                  size="xs"
                  variant="link"
                  onClick={onOnRampOpen}
                  colorScheme="white"
                  w="max-content"
                  leftIcon={<Image src="/images/kadoIcon.svg" />}
                >
                  Fund with Kado
                </Button>
                <OnRampModal isOpen={isOnRampOpen} onClose={onOnRampClose} />
                {featureFlags.squidIntegrationEnabled && (
                  <>
                    <Button
                      size="xs"
                      variant="link"
                      onClick={onSquidOpen}
                      colorScheme="white"
                      w="max-content"
                      leftIcon={<Image src="/images/squid.svg" w={4} h={4} />}
                    >
                      Bridge assets with Squid
                    </Button>
                    <SquidModal isOpen={isSquidOpen} onClose={onSquidClose} />
                  </>
                )}

                <Divider />
                <Button
                  size="xs"
                  w="max-content"
                  variant="link"
                  onClick={handleDisconnect}
                  leftIcon={<CalcIcon as={Remove1Icon} stroke="brand.200" />}
                >
                  Disconnect from {walletType}
                </Button>
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
