import { Button, Stack, Text, Image, Divider, Heading, AbsoluteCenter } from '@chakra-ui/react';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import usePageLoad from '@hooks/usePageLoad';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StepConfig } from 'src/formConfig/StepConfig';
import Lottie from 'lottie-react';
import * as Confetti from '../animations/confetti.json';

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
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={stepConfig} finalStep={false}>
        Strategy Set Successfully
      </NewStrategyModalHeader>
      <NewStrategyModalBody stepsConfig={stepConfig}>
        <AbsoluteCenter w="100%" h="100%" top="10%">
          <Lottie animationData={Confetti} loop={1} />
        </AbsoluteCenter>

        <Stack spacing={6} alignItems="center">
          <ThatsCalculatedThinkingText />
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
          <Link passHref href={generateStrategyDetailUrl(strategyId as string)}>
            <Button isLoading={isPageLoading}>View strategy details</Button>
          </Link>
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
