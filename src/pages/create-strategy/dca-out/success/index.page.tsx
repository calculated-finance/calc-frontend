import { Button, Stack, Text, Image, Divider, Heading } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useStrategy from '@hooks/useStrategy';
import totalExecutions from '@utils/totalExecutions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getInitialDenomBalance from '../../dca-in/success/getInitialDenomBalance';
import getSwapAmount from '../../dca-in/success/getSwapAmount';
import dcaOutSteps from '../dcaOutSteps';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  const { strategyId } = query;

  const { data: strategy } = useStrategy(strategyId as string);

  if (!strategy) {
    return null;
  }

  const timeSaved = totalExecutions(getInitialDenomBalance(strategy.vault), getSwapAmount(strategy.vault)) * 10;
  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={dcaOutSteps} finalStep={false}>
        Strategy Set Successfully
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={dcaOutSteps}>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text>CALC is now working for you!</Text>
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
