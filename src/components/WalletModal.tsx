import React, { useCallback, useMemo } from 'react';
import type { WalletName } from '@wizard-ui/core';
import { WalletReadyState } from '@wizard-ui/core';

// import { Collapse } from "./Collapse";
import {
  Box,
  Center,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '@wizard-ui/react';
import { useWalletModal } from '../hooks/useWalletModal';
import { WalletListItem } from './WalletListItem';
import Spinner from './Spinner';

function WalletModal() {
  const { wallets, select, connecting } = useWallet();
  const { visible, setVisible } = useWalletModal();

  const [installedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notDetected: Wallet[] = [];
    const loadable: Wallet[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    return [installed, [...loadable, ...notDetected]];
  }, [wallets]);

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
                {installedWallets.length ? (
                  installedWallets.map((wallet) => (
                    <Box>
                      <WalletListItem
                        key={wallet.adapter.name}
                        handleClick={() => handleWalletClick(wallet.adapter.name)}
                        wallet={wallet}
                      />
                    </Box>
                  ))
                ) : (
                  <Center>
                    <Text textStyle="body">No wallet extensions found</Text>
                  </Center>
                )}
                <Center>
                  <Link href="/">What&apos;s a Wallet?</Link>
                </Center>
              </Stack>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default WalletModal;
