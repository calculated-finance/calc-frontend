import { Button, Stack, Text, Image, Divider, Heading, AbsoluteCenter } from '@chakra-ui/react';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import { useRouter } from 'next/router';
import { StepConfig } from 'src/formConfig/StepConfig';
import Lottie from 'lottie-react';
import * as Confetti from '../animations/confetti.json';
import { Pages } from './Layout/Sidebar/Pages';
import { ModalWrapper } from './ModalWrapper';
import LinkWithQuery from './LinkWithQuery';

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
    <ModalWrapper stepsConfig={stepConfig}>
      <AbsoluteCenter w="100%" h="100%" top="10%">
        <Lottie animationData={Confetti} loop={1} />
      </AbsoluteCenter>

      <Stack spacing={6} alignItems="center">
        <ThatsCalculatedThinkingText />
        <Image src="/images/fire.svg" />
        <Text>CALC is now working for you!</Text>
        <>
          <Divider />
          <Stack spacing={2} alignItems="center">
            <Text>Plus, you have saved yourself an average of</Text>
            <Heading size="md">{timeSaved} minutes</Heading>
            <Text>and removed the emotions from your trades! 💪</Text>
          </Stack>
        </>
        {strategyId ? (
          <LinkWithQuery passHref href={generateStrategyDetailUrl(strategyId as string)}>
            <Button isLoading={isPageLoading}>View strategy details</Button>
          </LinkWithQuery>
        ) : (
          <LinkWithQuery passHref href={Pages.Strategies}>
            <Button isLoading={isPageLoading}>View strategies</Button>
          </LinkWithQuery>
        )}
      </Stack>
    </ModalWrapper>
  );
}
