import {
  Badge,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { ArrowLeftIcon, CheckedIcon } from '@fusion-icons/react/interface';
import DenomIcon from '@hooks/DenomIcon';
import { denoms } from '@hooks/usePairs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useCreateVault from 'src/hooks/useCreateVault';
import useDcaInForm from 'src/hooks/useDcaInForm';
import { NextPageWithLayout } from 'src/pages/_app';
import totalExecutions from 'src/utils/totalExecutions';

// eslint-disable-next-line react/function-component-definition
const ConfirmPurchase: NextPageWithLayout = () => {
  const { state, actions } = useDcaInForm();

  const router = useRouter();

  const { createVault, isLoading } = useCreateVault();

  const handleClick = () => {
    createVault(state, {
      onSuccess: async () => {
        actions.resetAction();
        router.push('success');
      },
      onError: async (error: any) => {
        console.log('something went wrong');
        console.log(error.message);
      },
    });
  };

  const { startDate, initialDeposit, swapAmount, executionInterval, quoteDenom, baseDenom } = state;

  // TODO: proper validation
  if (!startDate || !initialDeposit || !swapAmount || !executionInterval || !quoteDenom || !baseDenom) {
    return <div> Invalid data</div>;
  }

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader backUrl="/create-strategy/dca-in/step2" resetForm={actions.resetAction}>
        Confirm &amp; Sign
      </NewStrategyModalHeader>
      <NewStrategyModalBody>
        <Stack spacing={4}>
          <Text textStyle="body-xs">The deposit</Text>
          <Text>
            I deposit{' '}
            <Badge>
              {denoms[baseDenom].conversion(initialDeposit)} {denoms[baseDenom].name}
            </Badge>{' '}
            <DenomIcon denomName={baseDenom} /> into the CALC DCA In vault.
          </Text>
          <Text textStyle="body-xs">The swap</Text>
          <Text>
            Starting <Badge>{new Date(startDate).toLocaleDateString()}</Badge> at{' '}
            <Badge>{new Date(startDate).toLocaleTimeString()}</Badge>, CALC will swap{' '}
            <Badge>
              ~{denoms[baseDenom].conversion(swapAmount)} {denoms[baseDenom].name}
            </Badge>{' '}
            <DenomIcon denomName={baseDenom} /> for <Badge>{denoms[quoteDenom].name}</Badge>{' '}
            <DenomIcon denomName={quoteDenom} /> for{' '}
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
        </Stack>
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
};
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
