import { Button, Heading, Modal, ModalBody, ModalContent, ModalHeader, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import Link from 'next/link';
import { NextPageWithLayout } from 'src/pages/_app';

// eslint-disable-next-line react/function-component-definition
const Success: NextPageWithLayout = () => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  <NewStrategyModal>
    <NewStrategyModalHeader backUrl="/" resetForm={() => {}}>
      Strategy Set Successfully
    </NewStrategyModalHeader>
    <NewStrategyModalBody p={4}>
      <Text>Congratulations! CALC is now working for you!</Text>
      <Link passHref href="/strategies">
        <Button as="a" w="full">
          View my strategies
        </Button>
      </Link>
    </NewStrategyModalBody>
  </NewStrategyModal>
);
Success.getLayout = getFlowLayout;

export default Success;
