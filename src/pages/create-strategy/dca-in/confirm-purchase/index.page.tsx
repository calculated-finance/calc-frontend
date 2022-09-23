import { Badge, BadgeProps, Box, Button, Center, Divider, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { ArrowRightIcon, CheckedIcon, Loop2Icon } from '@fusion-icons/react/interface';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useRouter } from 'next/router';
import useDcaInForm, { useConfirmForm } from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import useCreateVault from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import Lottie from 'lottie-react';
import { DcaInFormDataAll } from '../../../../types/DcaInFormData';
import { ExecutionIntervals } from '../step2/ExecutionIntervals';
import { StartImmediatelyValues } from '../step2/StartImmediatelyValues';
import arrow from './arrow.json';

function BadgeButton({ children, ...props }: BadgeProps) {
  return (
    <Badge
      display="inline-flex"
      lineHeight={1.5}
      flexDirection="row"
      borderRadius="2xl"
      as="button"
      fontSize="sm"
      _hover={{ bg: 'blue.200', color: 'navy' }}
      size="large"
      bg="abyss.200"
      px={2}
      {...props}
    >
      <HStack spacing={1}>{children}</HStack>
    </Badge>
  );
}

export const executionIntervalDisplay = {
  [ExecutionIntervals.Hourly]: ['hour', 'hours'],
  [ExecutionIntervals.Daily]: ['day', 'days'],
  [ExecutionIntervals.Weekly]: ['week', 'weeks'],
  [ExecutionIntervals.Monthly]: ['month', 'months'],
};

export function DcaInDiagram({ quoteDenom, initialDeposit, baseDenom }: any) {
  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomName={quoteDenom} />
        <Text>
          {initialDeposit} {quoteDenomName}
        </Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <DenomIcon denomName={baseDenom} />
        <Text>{baseDenomName}</Text>
      </HStack>
    </Flex>
  );
}

function Confirm({ values }: { values: DcaInFormDataAll }) {
  const { actions } = useDcaInForm();

  const router = useRouter();

  const { mutate, isError, error, isLoading } = useCreateVault();

  const handleClick = () => {
    mutate(values, {
      onSuccess: async () => {
        await router.push('success');
        actions.resetAction();
      },
    });
  };

  const { quoteDenom, baseDenom, initialDeposit, swapAmount, startDate, executionInterval, startImmediately } = values;

  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);

  const formattedDate = new Date(startDate!).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(startDate!).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    hour12: false,
  });

  const executions = totalExecutions(initialDeposit, swapAmount);
  const displayExecutionInterval = executionIntervalDisplay[executionInterval][executions > 1 ? 1 : 0];
  return (
    <Stack spacing={4}>
      <DcaInDiagram quoteDenom={quoteDenom} baseDenom={baseDenom} initialDeposit={initialDeposit} />
      <Divider />
      <Box>
        <Text textStyle="body-xs">Your deposit</Text>
        <Text lineHeight={8}>
          I deposit{' '}
          <BadgeButton>
            <Text>
              {initialDeposit} {quoteDenomName}
            </Text>
            <DenomIcon denomName={quoteDenom} />{' '}
          </BadgeButton>{' '}
          Into the CALC DCA In vault.
        </Text>
      </Box>
      <Box>
        <Text textStyle="body-xs">The swap</Text>
        <Text lineHeight={8}>
          Starting{' '}
          {startImmediately === StartImmediatelyValues.Yes ? (
            <BadgeButton>
              <Text>Immediately</Text>
            </BadgeButton>
          ) : (
            <>
              <BadgeButton>
                <Text>{formattedDate}</Text>
              </BadgeButton>{' '}
              at{' '}
              <BadgeButton>
                <Text>{formattedTime}</Text>
              </BadgeButton>{' '}
            </>
          )}
          , CALC will swap{' '}
          <BadgeButton>
            <Text>
              ~{swapAmount} {quoteDenomName}
            </Text>
            <DenomIcon denomName={quoteDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton>
            <Text>{baseDenomName}</Text>
            <DenomIcon denomName={baseDenom} />
          </BadgeButton>{' '}
          for{' '}
          <BadgeButton>
            <Text>
              {executions} {displayExecutionInterval}
            </Text>
          </BadgeButton>{' '}
          .
        </Text>
      </Box>
      <Button w="full" isLoading={isLoading} rightIcon={<Icon as={CheckedIcon} stroke="navy" />} onClick={handleClick}>
        Confirm
      </Button>
      {isError && (
        <>
          <Text color="red">Something went wrong</Text>
          <Text>{JSON.stringify(error)}</Text>
        </>
      )}
    </Stack>
  );
}

function InvalidData() {
  const router = useRouter();
  const { actions } = useConfirmForm();

  const handleClick = () => {
    actions.resetAction();
    router.push('/create-strategy/dca-in');
  };
  return (
    <Center>
      {/* Better to link to start of specific strategy */}
      Invalid Data, please&nbsp;
      <Button onClick={handleClick} variant="link">
        restart
      </Button>
    </Center>
  );
}

function ConfirmPurchase() {
  const { state, actions } = useConfirmForm();
  const { isPageLoading } = usePageLoad();

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Confirm &amp; Sign</NewStrategyModalHeader>
      <NewStrategyModalBody isLoading={isPageLoading}>
        {state ? <Confirm values={state} /> : <InvalidData />}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
