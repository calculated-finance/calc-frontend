/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { useExecuteContract } from '@wizard-ui/react';
import { useStateMachine } from 'little-state-machine';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CONTRACT_ADDRESS } from 'src/constants';
import { NextPageWithLayout } from 'src/pages/_app';
import updateAction from '../../../updateAction';

const totalExecutions = (initialDeposit: number, swapAmount: number) => Math.floor(initialDeposit / swapAmount);

// eslint-disable-next-line react/function-component-definition
const DcaInStep2: NextPageWithLayout = () => {
  // @ts-ignore
  const { state } = useStateMachine(updateAction);

  // next router
  const router = useRouter();

  const { mutate, ...rest } = useExecuteContract({
    address: CONTRACT_ADDRESS,
  });

  console.log('rest', rest);

  const handleClick = () => {
    mutate(
      {
        msg: {
          create_vault: {
            execution_interval: state.executionInterval,
            pair_address: 'kujira1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3sl8nek6',
            position_type: 'enter',
            swap_amount: state.swapAmount.toString(),
            // floor
            total_executions: totalExecutions(state.initialDeposit, state.swapAmount),
            target_start_time_utc: new Date(state.startDate).toISOString(),
          },
        },
        funds: [{ denom: state.quoteDenom, amount: state.initialDeposit.toString() }],
      },
      {
        onSuccess: (data) => {
          console.log('data', data);
          // route to strategies page
          router.push('/strategies');
        },
      },
    );
  };

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
                {state.initialDeposit} {state.baseDenom}
              </Badge>{' '}
              into the CALC DCA In vault.
            </Text>
            <Text textStyle="body-xs">The swap</Text>
            <Text>
              Starting <Badge>{new Date(state.startDate).toLocaleDateString()}</Badge> at{' '}
              <Badge>{new Date(state.startDate).toTimeString()}</Badge>, CALC will swap{' '}
              <Badge>
                ~{state.swapAmount} {state.baseDenom}
              </Badge>{' '}
              for <Badge>{state.quoteDenom}</Badge> for{' '}
              <Badge>
                {totalExecutions(state.initialDeposit, state.swapAmount)} {state.executionInterval}
              </Badge>{' '}
              .
            </Text>
            <Button w="full" rightIcon={<Icon as={CheckedIcon} stroke="navy" />} onClick={handleClick}>
              Confirm
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
DcaInStep2.getLayout = getFlowLayout;

export default DcaInStep2;
