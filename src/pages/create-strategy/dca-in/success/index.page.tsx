import { Button, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';

function Success() {
  const { isPageLoading } = usePageLoad();
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader>Strategy Set Successfully</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Text>Congratulations! CALC is now working for you!</Text>
        <Link passHref href="/strategies">
          <Button as="a" w="full" isLoading={isPageLoading}>
            View my strategies
          </Button>
        </Link>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Success.getLayout = getFlowLayout;

export default Success;
