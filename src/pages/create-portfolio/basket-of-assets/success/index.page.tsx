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
        Success
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={steps}>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text textAlign="center">Your basket of assets have been created and you are ready to start buying!</Text>
          <>
            <Divider />
            <Text textAlign="center">
              Now it’s time to add some funds to
              <Heading p={2} size="md">
                (basket name)
              </Heading>
            </Text>
          </>
          <Stack>
            <Link passHref href="/strategies">
              <Button as="a" isLoading={isPageLoading}>
                Add funds
              </Button>
            </Link>
            <Link passHref href="/strategies">
              <Button as="a" isLoading={isPageLoading} colorScheme="blue" variant="outline">
                Share basket
              </Button>
            </Link>
          </Stack>
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Success.getLayout = getFlowLayout;

export default Success;
