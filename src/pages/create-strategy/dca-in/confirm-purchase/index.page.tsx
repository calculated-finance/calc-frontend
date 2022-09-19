import { Badge, BadgeProps, Button, Center, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { ArrowRightIcon, CheckedIcon, Loop2Icon } from '@fusion-icons/react/interface';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useRouter } from 'next/router';
import useDcaInForm from 'src/hooks/useDcaInForm';
import totalExecutions from 'src/utils/totalExecutions';
import useCreateVault from '@hooks/useCreateVault';
import usePageLoad from '@hooks/usePageLoad';
import { allValidationSchema, DcaInFormDataAll } from '../../../../types/DcaInFormData';
import { ExecutionIntervals } from '../step2/ExecutionIntervals';

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

const executionIntervalDisplay = {
  [ExecutionIntervals.Hourly]: ['hour', 'hours'],
  [ExecutionIntervals.Daily]: ['day', 'days'],
  [ExecutionIntervals.Weekly]: ['week', 'weeks'],
  [ExecutionIntervals.Monthly]: ['month', 'months'],
};

function Confirm({ values }: { values: DcaInFormDataAll }) {
  const { actions } = useDcaInForm();

  const router = useRouter();

  const { mutate, isError, isLoading } = useCreateVault();

  const handleClick = () => {
    mutate(values, {
      onSuccess: async () => {
        actions.resetAction();
        router.push('success');
      },
    });
  };

  const { quoteDenom, baseDenom, initialDeposit, swapAmount, startDate, executionInterval } = values;

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
      <Flex w="full" justifyContent="space-between">
        <DenomIcon denomName={quoteDenom} />
        <Text>
          {initialDeposit} {baseDenomName}
        </Text>
        <Icon as={ArrowRightIcon} />
        <Text>{executions}</Text>
        <Icon as={Loop2Icon} />
        <Text>swaps</Text>
        <Icon as={ArrowRightIcon} />
        <DenomIcon denomName={baseDenom} />
      </Flex>
      <Text textStyle="body-xs">The swap</Text>
      <Text lineHeight={8}>
        Starting{' '}
        <BadgeButton>
          <Text>{formattedDate}</Text>
        </BadgeButton>{' '}
        at{' '}
        <BadgeButton>
          <Text>{formattedTime}</Text>
        </BadgeButton>{' '}
        , CALC will swap{' '}
        <BadgeButton>
          <Text>
            ~{swapAmount} {baseDenomName}
          </Text>
          <DenomIcon denomName={baseDenom} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton>
          <Text>{quoteDenomName}</Text>
          <DenomIcon denomName={quoteDenom} />
        </BadgeButton>{' '}
        for{' '}
        <BadgeButton>
          <Text>
            {executions} {displayExecutionInterval}
          </Text>
        </BadgeButton>{' '}
        .
      </Text>
      <Button w="full" isLoading={isLoading} rightIcon={<Icon as={CheckedIcon} stroke="navy" />} onClick={handleClick}>
        Confirm
      </Button>
      {isError && <Text color="red">Something went wrong</Text>}
    </Stack>
  );
}

function ConfirmPurchase() {
  const { state, actions } = useDcaInForm();

  const { isPageLoading } = usePageLoad();

  const flatState = { ...state.step1, ...state.step2 };

  const values = allValidationSchema.validateSync(flatState);

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Confirm &amp; Sign</NewStrategyModalHeader>
      <NewStrategyModalBody isLoading={isPageLoading}>
        {values ? <Confirm values={values} /> : <Center>Invalid Data</Center>}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
