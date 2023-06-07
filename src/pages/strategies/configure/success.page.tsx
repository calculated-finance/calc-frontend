import { Button, Stack, Text, Divider, Box } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Configure from 'src/animations/configure.json';
import Lottie from 'lottie-react';
import { configureSteps } from './index.page';

function Success() {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader showStepper={false} finalStep={false} stepsConfig={configureSteps} />
      <NewStrategyModalBody stepsConfig={configureSteps}>
        <Stack spacing={6} alignItems="center">
          <Box as={Lottie} animationData={Configure} mt={-10} mb={-12} />
          <Text textAlign="center">Strategy destination updated.</Text>
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
