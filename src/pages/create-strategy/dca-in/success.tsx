import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import Link from 'next/link';
import { NextPageWithLayout } from 'src/pages/_app';

// eslint-disable-next-line react/function-component-definition
const Success: NextPageWithLayout = () => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  <Modal isOpen onClose={() => {}}>
    <ModalContent>
      <ModalHeader textAlign="center">Congratulations! CALC is now working for you!</ModalHeader>
      <ModalBody p={4}>
        <Link passHref href="/strategies">
          <Button as="a" w="full">
            View my strategies
          </Button>
        </Link>
      </ModalBody>
    </ModalContent>
  </Modal>
);
Success.getLayout = getFlowLayout;

export default Success;
