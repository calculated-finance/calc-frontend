import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Center,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useSize } from 'ahooks';
import { KADO_API_KEY } from 'src/constants';
import { useWallet } from '@wizard-ui/react';
import ConnectWallet from '@components/ConnectWallet';

function OnRampModalContent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { connected, address } = useWallet();

  const dimensions = useSize(elementRef);

  return (
    <ModalContent height="full" maxHeight={800}>
      <ModalHeader>Get axlUSDC now</ModalHeader>
      <ModalCloseButton />
      <ModalBody p={0} height="full">
        <Box ref={elementRef} height="full">
          {connected ? (
            <iframe
              title="kado"
              src={`https://app.kado.money/?apiKey=${KADO_API_KEY}&onRevCurrency=USDC&onToAddress=${address}&cryptoList=USDC&network=kujira&product=BUY`}
              width="100%"
              height={`${dimensions?.height}`}
            />
          ) : (
            <Center h="full">
              <ConnectWallet />
            </Center>
          )}
        </Box>
      </ModalBody>
    </ModalContent>
  );
}

export default function OnRampModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <OnRampModalContent />
    </Modal>
  );
}
