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
import { ArrowLeftIcon, CheckedIcon } from '@fusion-icons/react/interface';
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
    console.log(state);
    return <div> Invalid data</div>;
  }

  return (
    <Modal isOpen onClose={() => {}}>
      <ModalContent>
        <ModalHeader textAlign="center">
          <Flex>
            <Link passHref href="/create-strategy/dca-in/step2">
              <Icon cursor="pointer" as={ArrowLeftIcon} />
            </Link>
            <Spacer />
            <Text>DCA in</Text>
            <Spacer />
            <Button>Cancel</Button>
          </Flex>
        </ModalHeader>
        <ModalBody p={4}>
          <Stack spacing={4}>
            <Text textStyle="body-xs">The deposit</Text>
            <Text>
              I deposit{' '}
              <Badge>
                {initialDeposit} {baseDenom}
              </Badge>{' '}
              into the CALC DCA In vault.
            </Text>
            <Text textStyle="body-xs">The swap</Text>
            <Text>
              Starting <Badge>{new Date(startDate).toLocaleDateString()}</Badge> at{' '}
              <Badge>{new Date(startDate).toTimeString()}</Badge>, CALC will swap{' '}
              <Badge>
                ~{swapAmount} {baseDenom}
              </Badge>{' '}
              for <Badge>{quoteDenom}</Badge> for{' '}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
