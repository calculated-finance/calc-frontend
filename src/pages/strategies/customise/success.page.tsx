import { Button, Stack, Text, Divider, Box } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import { useRouter } from 'next/router';
import * as Configure from 'src/animations/configure.json';
import Lottie from 'lottie-react';
import LinkWithQuery from '@components/LinkWithQuery';
import { customiseSteps } from './customiseSteps';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader
        showStepper={false}
        stepsConfig={customiseSteps}
        cancelUrl={generateStrategyDetailUrl(query?.id as string)}
      />
      <NewStrategyModalBody stepsConfig={customiseSteps}>
        <Stack spacing={6} alignItems="center">
          <Box as={Lottie} animationData={Configure} mt={-10} mb={-12} />
          <Text textAlign="center">Strategy updated</Text>
          <Divider />
          <LinkWithQuery passHref href={generateStrategyDetailUrl(query.strategyId as string)}>
            <Button isLoading={isPageLoading}>View strategy details</Button>
          </LinkWithQuery>
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

Success.getLayout = getFlowLayout;

export default Success;
