import { Button, Heading, Stack, Text, Image, Divider, Center, Flex } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';
import { BadgeButton } from '../confirm-purchase/index.page';

function Success() {
  const { isPageLoading } = usePageLoad();
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader finalStep={false}>Strategy Set Successfully</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text>CALC is now working for you!</Text>
          <Divider />
          <Text textAlign="center">
            Plus, you have saved yourself an average of
            <br />
            <BadgeButton>
              <Text>120 minutes</Text>
            </BadgeButton>
            <br />
            and removed the emotions from your trades! 💪
          </Text>
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
