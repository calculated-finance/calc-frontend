import { Badge, Button, Stack, Text } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import { useRouter } from 'next/router';
import useDcaInForm from 'src/hooks/useDcaInForm';
import { NextPageWithLayout } from 'src/pages/_app.page';
import totalExecutions from 'src/utils/totalExecutions';
import useCreateVault from '@hooks/useCreateVault';

// eslint-disable-next-line react/function-component-definition
const ConfirmPurchase: NextPageWithLayout = () => {
  const { state, actions } = useDcaInForm();

  const router = useRouter();

  const { mutate, isError, isLoading } = useCreateVault(state);

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: async () => {
        actions.resetAction();
        router.push('success');
      },
    });
  };

  const {
    step2: { startDate, executionInterval, swapAmount },
    step1: { initialDeposit, quoteDenom, baseDenom },
  } = state;

  // TODO: proper validation
  if (!startDate || !initialDeposit || !swapAmount || !executionInterval || !quoteDenom || !baseDenom) {
    return <div> Invalid data</div>;
  }

  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Confirm &amp; Sign</NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Stack spacing={4}>
          <Text textStyle="body-xs">The deposit</Text>
          <Text>
            I deposit{' '}
            <Badge>
              {initialDeposit} {baseDenomName}
            </Badge>{' '}
            <DenomIcon denomName={baseDenom} /> into the CALC DCA In vault.
          </Text>
          <Text textStyle="body-xs">The swap</Text>
          <Text>
            Starting <Badge>{new Date(startDate).toLocaleDateString()}</Badge> at{' '}
            <Badge>{new Date(startDate).toLocaleTimeString()}</Badge>, CALC will swap{' '}
            <Badge>
              ~{swapAmount} {baseDenomName}
            </Badge>{' '}
            <DenomIcon denomName={baseDenom} /> for <Badge>{quoteDenomName}</Badge> <DenomIcon denomName={quoteDenom} />{' '}
            for{' '}
            <Badge>
              {totalExecutions(initialDeposit, swapAmount)} {executionInterval}
            </Badge>{' '}
            .
          </Text>
          <Button
            w="full"
            isLoading={isLoading}
            rightIcon={<Icon as={CheckedIcon} stroke="navy" />}
            onClick={handleClick}
          >
            Confirm
          </Button>
          {isError && <Text color="red">Something went wrong</Text>}
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
};
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
