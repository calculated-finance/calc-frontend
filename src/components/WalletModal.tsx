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
import { useChain } from '@hooks/useChain';
import { useLeap } from '@hooks/useLeap';
import { useXDEFI } from '@hooks/useXDEFI';
import { useAdmin } from '@hooks/useAdmin';
import { WalletListItem } from './WalletListItem';
import Spinner from './Spinner';

function WalletModal() {
  const { visible, setVisible } = useWalletModal();

  const { isConnecting } = useWallet();

  const { isAdminPage } = useAdmin();

  const { isStationInstalled, connect: connectStation } = useStation((state) => ({
    isStationInstalled: state.isStationInstalled,
    connect: state.connect,
  }));

  const { isInstalled: isKeplrInstalled, connect: connectKeplr } = useKeplr((state) => ({
    isInstalled: state.isInstalled,
    connect: state.connect,
  }));

  const { isInstalled: isLeapInstalled, connect: connectLeap } = useLeap((state) => ({
    isInstalled: state.isInstalled,
    connect: state.connect,
  }));

  const { isInstalled: isXDEFIInstalled, connect: connectXDEFI } = useXDEFI((state) => ({
    isInstalled: state.isInstalled,
    connect: state.connect,
  }));

  const { chain } = useChain();

  const { isOpen, onToggle } = useDisclosure();

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleStationConnect = () => {
    connectStation?.();
    handleClose();
  };

  const handleKeplrConnect = () => {
    connectKeplr(chain);
    handleClose();
  };

  const handleLeapConnect = () => {
    connectLeap(chain);
    handleClose();
  };

  const handleXDEFIConnect = () => {
    connectXDEFI(chain);
    handleClose();
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
                  name="Keplr Wallet"
                  icon="/images/keplr.png"
                  isInstalled={isKeplrInstalled}
                  walletInstallLink="https://www.keplr.app/download"
                />
                {featureFlags.stationEnabled && (
                  <WalletListItem
                    handleClick={handleStationConnect}
                    name="Terra Station"
                    icon="/images/station.svg"
                    isInstalled={isStationInstalled}
                    walletInstallLink="https://setup-station.terra.money/"
                  />
                )}
                {featureFlags.leapEnabled && (
                  <WalletListItem
                    handleClick={handleLeapConnect}
                    name="Leap Wallet"
                    icon="/images/leap.svg"
                    isInstalled={isLeapInstalled}
                    walletInstallLink="https://www.leapwallet.io/download"
                  />
                )}
                {(featureFlags.XDEFIEnabled || isAdminPage) && (
                  <WalletListItem
                    handleClick={handleXDEFIConnect}
                    name="XDEFI Wallet"
                    icon="/images/xdefi.png"
                    isInstalled={isXDEFIInstalled}
                    walletInstallLink="https://www.xdefi.io/"
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
