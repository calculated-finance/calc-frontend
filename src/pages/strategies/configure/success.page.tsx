import { Button, Stack, Text, Image, Divider, Heading } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import useStrategy from '@hooks/useStrategy';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getDenomName } from '@helpers/getDenomName';
import { getStrategyInitialDenom } from '@helpers/strategy';
import { topUpSteps } from './index.page';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  const { strategyId, timeSaved } = query;

  const { data, isLoading } = useStrategy(strategyId as string);

  if (!data) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader showStepper={false} finalStep={false} stepsConfig={topUpSteps}>
          Top Up Successful
        </NewStrategyModalHeader>
        <NewStrategyModalBody isLoading={isLoading} stepsConfig={topUpSteps}>
          loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const initialDenomName = getDenomName(getStrategyInitialDenom(data.vault));

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader showStepper={false} finalStep={false} stepsConfig={topUpSteps}>
        Top Up Successful
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={topUpSteps}>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/congratulations.svg" />
          <Image src="/images/fire.svg" />
          <Text textAlign="center">
            Your {initialDenomName} deposit was successful. Your vault has been topped up with new funds.
          </Text>
          <>
            <Divider />
            <Stack spacing={2} alignItems="center">
              <Text>Plus, you have saved yourself an average of</Text>
              <Heading size="md">{timeSaved} minutes</Heading>
              <Text>and removed the emotions from your trades! 💪</Text>
            </Stack>
          </>
          <Link passHref href={generateStrategyDetailUrl(query.strategyId as string)}>
            <Button isLoading={isPageLoading}>View strategy details</Button>
          </Link>
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
Success.getLayout = getFlowLayout;

export default Success;
