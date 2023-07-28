import { Button, Stack, Text, Divider, Heading, Box } from '@chakra-ui/react';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import { useRouter } from 'next/router';
import { StepConfig } from 'src/formConfig/StepConfig';
import React, { Suspense } from 'react';
import * as Configure from 'src/animations/configure.json';
import Lottie from 'lottie-react';
import { Pages } from './Layout/Sidebar/Pages';

const ModalWrapper = React.lazy(() =>
  import('@components/ModalWrapper').then((module) => ({ default: module.ModalWrapper })),
);
const LinkWithQuery = React.lazy(() => import('./LinkWithQuery'));

function ThatsCalculatedThinkingText() {
  return (
    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
      NOW{' '}
      <Text as="span" color="brand.200">
        THAT&apos;S{' '}
      </Text>
      <br />
      <Text as="span" color="blue.200">
        CALCULATED{' '}
      </Text>
      THINKING
    </Text>
  );
}

export function SuccessStrategyModal({ stepConfig }: { stepConfig: StepConfig[] }) {
  const { isPageLoading } = usePageLoad();
  const { query } = useRouter();
  const { strategyId, timeSaved } = query;
  return (
    <Suspense fallback={<Box />}>
      <ModalWrapper stepsConfig={stepConfig}>
        <Stack spacing={6} alignItems="center">
          <ThatsCalculatedThinkingText />
          <Box as={Lottie} animationData={Configure} />
          <>
            <Divider />
            <Stack spacing={2} alignItems="center">
              <Text>You have saved yourself an average of</Text>
              <Heading size="md">{timeSaved} minutes</Heading>
              <Text>and removed the emotions from your trades! 💪</Text>
            </Stack>
          </>
          {strategyId ? (
            <Suspense>
              <LinkWithQuery passHref href={generateStrategyDetailUrl(strategyId as string)}>
                <Button isLoading={isPageLoading}>View strategy details</Button>
              </LinkWithQuery>
            </Suspense>
          ) : (
            <Suspense>
              <LinkWithQuery passHref href={Pages.Strategies}>
                <Button isLoading={isPageLoading}>View strategies</Button>
              </LinkWithQuery>
            </Suspense>
          )}
        </Stack>
      </ModalWrapper>
    </Suspense>
  );
}
