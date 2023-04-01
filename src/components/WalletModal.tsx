import { useCallback } from 'react';

import {
  Button,
  Center,
  Collapse,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useWalletModal } from '@hooks/useWalletModal';
import { useStation } from '@hooks/useStation';
import { featureFlags } from 'src/constants';
import { useKeplr } from '@hooks/useKeplr';
import { useWallet } from '@hooks/useWallet';
import { WalletListItem } from './WalletListItem';
import Spinner from './Spinner';

function WalletModal() {
  const { visible, setVisible } = useWalletModal();

  const { isConnecting } = useWallet();

  const { isStationInstalled, connect: connectStation } = useStation((state) => ({
    isStationInstalled: state.isStationInstalled,
    connect: state.connect,
  }));

  const { isInstalled: isKeplrInstalled, connect: connectKeplr } = useKeplr((state) => ({
    isInstalled: state.isInstalled,
    connect: state.connect,
  }));

  const { isOpen, onToggle } = useDisclosure();

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleStationConnect = () => {
    connectStation?.();
    handleClose();
  };

  const handleKeplrConnect = () => {
    connectKeplr?.();
    handleClose();
  };

  const stationWalletData = {
    adapter: {
      name: 'Terra Station',
      icon: '/images/station.svg',
    },
    readyState: isStationInstalled ? 'Installed' : 'NotDetected',
  };

  const keplrWalletData = {
    adapter: {
      name: 'Keplr Wallet',
      icon: '/images/keplr.png',
    },
    readyState: isKeplrInstalled ? 'Installed' : 'NotDetected',
  };

  return (
    <Modal isOpen={visible || isConnecting} onClose={handleClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        {isConnecting ? (
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
                <WalletListItem
                  handleClick={handleKeplrConnect}
                  wallet={keplrWalletData}
                  walletInstallLink="https://www.keplr.app/download"
                />
                {featureFlags.stationEnabled && (
                  <WalletListItem
                    handleClick={handleStationConnect}
                    wallet={stationWalletData}
                    walletInstallLink="https://setup-station.terra.money/"
                  />
                )}

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
