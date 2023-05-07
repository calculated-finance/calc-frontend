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
import { configureSteps } from './index.page';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  const { strategyId, timeSaved } = query;

  const { data, isLoading } = useStrategy(strategyId as string);

  if (!data) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader showStepper={false} finalStep={false} stepsConfig={configureSteps}>
          Top Up Successful
        </NewStrategyModalHeader>
        <NewStrategyModalBody isLoading={isLoading} stepsConfig={configureSteps}>
          loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const initialDenomName = getDenomName(getStrategyInitialDenom(data.vault));

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader showStepper={false} finalStep={false} stepsConfig={configureSteps}>
        Configuration Successful
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={configureSteps}>
        <Stack spacing={6} alignItems="center">
          <Image src="/images/tick.svg" />
          <Text textAlign="center">Post-swap action updated.</Text>
          <Divider />
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
