import { Button, Stack, Text, Image, Divider, Heading } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import useStrategy from '@hooks/useStrategy';
import totalExecutions from '@utils/totalExecutions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getStrategyBalance from 'src/pages/create-strategy/dca-in/success/getInitialDenomBalance';
import { getStrategyTimeSaved } from 'src/pages/create-strategy/dca-in/success/getStrategyTimeSaved';
import getSwapAmount from 'src/pages/create-strategy/dca-in/success/getSwapAmount';
import { getDenomName, getInitialDenom, getStrategyInitialDenom } from '../details/getInitialDenom';
import { topUpSteps } from './index.page';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  const { strategyId } = query;

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

  const timeSaved = getStrategyTimeSaved(data.vault);
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
            <Text textAlign="center">
              Plus, you have saved yourself an average of
              <Heading p={2} size="md">
                {timeSaved} minutes
              </Heading>
              and removed the emotions from your trades! 💪
            </Text>
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
