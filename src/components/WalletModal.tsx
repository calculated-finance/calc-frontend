import React, { useCallback, useMemo } from 'react';
import type { WalletName } from '@wizard-ui/core';
import { WalletReadyState } from '@wizard-ui/core';

// import { Collapse } from "./Collapse";
import {
  Box,
  Button,
  Center,
  Collapse,
  Link,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  ModalFooter,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '@wizard-ui/react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useWalletModal } from '../hooks/useWalletModal';
import { WalletListItem } from './WalletListItem';
import Spinner from './Spinner';

function WalletModal() {
  const { wallets, select, connecting } = useWallet();
  const { visible, setVisible } = useWalletModal();

  const { isOpen, onToggle } = useDisclosure();

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleWalletClick = useCallback(
    (walletName: WalletName) => {
      select(walletName);
      handleClose();
    },
    [select, handleClose],
  );

  // const isMobile = useCallback(() => {
  //   /Mobi/.test(navigator.userAgent);
  // }, []);

  return (
    <Modal isOpen={visible || connecting} onClose={handleClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        {connecting ? (
          <>
            <ModalHeader textAlign="center">Connecting to wallet</ModalHeader>
            <ModalBody>
              <Center>
                <Spinner />
              </Center>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader textAlign="center">Connect wallet</ModalHeader>
            <ModalBody>
              <Stack spacing={6}>
                {wallets.map((wallet) => (
                  <Box>
                    <WalletListItem
                      key={wallet.adapter.name}
                      handleClick={() => handleWalletClick(wallet.adapter.name)}
                      wallet={wallet}
                      walletInstallLink="https://www.keplr.app/download"
                    />
                  </Box>
                ))}

                <Stack>
                  <Button
                    onClick={onToggle}
                    variant="ghost"
                    colorScheme="blue"
                    rightIcon={isOpen ? <Icon as={FiChevronUp} /> : <Icon as={FiChevronDown} />}
                  >
                    What&apos;s a Wallet?
                  </Button>
                  <Collapse in={isOpen}>
                    <Stack textStyle="body">
                      <Text>
                        A wallet or a cryptocurrency wallet stores your public and private keys while providing an
                        easy-to-use interface to manage crypto balances.
                      </Text>
                      <Text>
                        It is your tool for both authentications (no more username and password) as well as your ticket
                        to access decentralised apps (like CALC). Each wallet has an address and that&apos;s how people
                        send you money.
                      </Text>
                      <Text>
                        You can connect your wallet to CALC to start using it. If you don&apos;t have a wallet yet, open
                        one up and come back!
                      </Text>
                    </Stack>
                  </Collapse>
                </Stack>
              </Stack>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default WalletModal;
