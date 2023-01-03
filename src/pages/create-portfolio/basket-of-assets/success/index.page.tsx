import { Button, Stack, Text, Image, Divider, Heading } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useStrategy from '@hooks/useStrategy';
import Link from 'next/link';
import { useRouter } from 'next/router';
import steps from '../steps';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={steps} finalStep={false}>
        Strategy Set Successfully
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={steps}>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text>CALC is now working for you!</Text>

          <Link passHref href="/strategies">
            <Button as="a" isLoading={isPageLoading}>
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
