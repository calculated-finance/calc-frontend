import { ModalBody, ModalCloseButton, ModalContent, ModalHeader, Center, Modal, ModalOverlay } from '@chakra-ui/react';
import { KADO_API_KEY } from 'src/constants';
import ConnectWallet from '@components/ConnectWallet';
import { useChainId } from '@hooks/useChainId';
import { useChainContext } from '@hooks/useChainContext';

function OnRampModalContent() {
  const chainContext = useChainContext();
  const { chainId } = useChainId();

  if (!chainContext) {
    return (
      <Center h={440}>
        <ConnectWallet />
      </Center>
    );
  }

  const network = {
    'kaiyo-1': 'kujira',
    'osmosis-1': 'osmosis',
    'harpoon-4': 'kujira',
    'osmo-test-5': 'osmosis',
    'archway-1': 'archway',
    'constantine-3': 'archway',
    'neutron-1': 'neutron',
    'pion-1': 'neutron',
  }[chainId]!;

  const { isWalletConnected, address } = chainContext;

  return (
    <ModalContent mx={6}>
      <ModalHeader>Get axlUSDC now</ModalHeader>
      <ModalCloseButton />
      <ModalBody px={0} pb={8}>
        {isWalletConnected ? (
          <iframe
            title="kado"
            src={`https://app.kado.money/?apiKey=${KADO_API_KEY}&onRevCurrency=USDC&onToAddress=${address}&cryptoList=USDC&network=${network}&product=BUY`}
            width="100%"
            height={680}
          />
        ) : (
          <Center h={440}>
            <ConnectWallet />
          </Center>
        )}
      </ModalBody>
    </ModalContent>
  );
}

export default function OnRampModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false}>
      <ModalOverlay />
      <OnRampModalContent />
    </Modal>
  );
}
