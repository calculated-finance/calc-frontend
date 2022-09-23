import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';

function Success() {
  const { isPageLoading } = usePageLoad();
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader finalStep={false}>Strategy Set Successfully</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Stack spacing={6} alignItems="center">
          <Heading size="md">Congratulations!</Heading>
          <Text>CALC is now working for you!</Text>
          <Link passHref href="/strategies">
            <Button as="a" w="full" isLoading={isPageLoading}>
              View my strategies
            </Button>
          </Link>
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Success.getLayout = getFlowLayout;

export default Success;
