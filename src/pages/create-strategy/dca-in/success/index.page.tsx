import { Button, Stack, Text, Image, Divider, Heading } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  console.log(query);
  const timeSaved = query.time_saved;
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader finalStep={false}>Strategy Set Successfully</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text>CALC is now working for you!</Text>
          {Boolean(timeSaved) && (
            <>
              <Divider />
              <Text textAlign="center">
                Plus, you have saved yourself an average of
                <Heading p={2} size="md">
                  {timeSaved} minutes
                </Heading>
                and removed the emotions from your trades! 💪
              </Text>
            </>
          )}
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
