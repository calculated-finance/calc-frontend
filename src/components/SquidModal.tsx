import { ModalBody, ModalCloseButton, ModalContent, ModalHeader, Center, Modal, ModalOverlay } from '@chakra-ui/react';
import { useWallet } from '@hooks/useWallet';
import ConnectWallet from '@components/ConnectWallet';

function SquidModalContent() {
  const { connected, address } = useWallet();

  return (
    <ModalContent mx={6} width={420} height={641}>
      <ModalHeader>Bridge assets now</ModalHeader>
      <ModalCloseButton />
      <ModalBody px={0} pb={8}>
        {connected ? (
          <iframe
            title="squid_widget"
            width="420"
            height="641"
            src="https://widget.squidrouter.com/iframe?config=%7B%22companyName%22%3A%22Custom%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%23B1ACA1%22%2C%22baseContent%22%3A%22%23ffffff%22%2C%22base100%22%3A%22%23474745%22%2C%22base200%22%3A%22%23191c24%22%2C%22base300%22%3A%22%23191c25%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%2362C555%22%2C%22primary%22%3A%22%23ffb636%22%2C%22secondary%22%3A%22%239ccbf0%22%2C%22secondaryContent%22%3A%22%2301020C%22%2C%22neutral%22%3A%22%230C0F12%22%2C%22roundedBtn%22%3A%225px%22%2C%22roundedBox%22%3A%220px%22%2C%22roundedDropDown%22%3A%220px%22%2C%22displayDivider%22%3Afalse%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22instantExec%22%3Afalse%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22comingSoonChainIds%22%3A%5B42161%2C%22cosmoshub-4%22%2C%22injective-1%22%2C%22axelar-dojo-1%22%2C%22fetchhub-4%22%2C%22kichain-2%22%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Convert%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Tokens%22%2C%22chains%22%3A%22Chains%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22destination%22%3A%22Destination%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%7D"
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

export default function SquidModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false}>
      <ModalOverlay />
      <SquidModalContent />
    </Modal>
  );
}
