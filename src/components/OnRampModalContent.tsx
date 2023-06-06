import { ModalBody, ModalCloseButton, ModalContent, ModalHeader, Center, Modal, ModalOverlay } from '@chakra-ui/react';
import { KADO_API_KEY } from 'src/constants';
import { useWallet } from '@hooks/useWallet';
import ConnectWallet from '@components/ConnectWallet';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';

function OnRampModalContent() {
  const { connected, address } = useWallet();
  const { chain } = useChain();

  const network = chain === Chains.Kujira ? 'kujira' : 'osmosis';

  return (
    <ModalContent mx={6}>
      <ModalHeader>Get axlUSDC now</ModalHeader>
      <ModalCloseButton />
      <ModalBody px={0} pb={8}>
        {connected ? (
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
