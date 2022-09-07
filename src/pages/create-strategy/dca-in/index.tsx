import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import { ArrowLeftIcon } from '@fusion-icons/react/interface';
import { useStateMachine } from 'little-state-machine';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { NextPageWithLayout } from 'src/pages/_app';
import updateAction, { FormData } from './updateAction';

// eslint-disable-next-line react/function-component-definition
const DcaIn: NextPageWithLayout = () => {
  const router = useRouter();
  const { actions, state } = useStateMachine({ updateAction });

  const onSubmit = (data: any) => {
    actions.updateAction(data);
    router.push('/create-strategy/dca-in/step2');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: state,
  });

  return (
    <Modal isOpen onClose={() => {}}>
      {/* <ModalOverlay /> */}
      <ModalContent>
        <ModalHeader textAlign="center">
          <Flex>
            <Link passHref href="/create-strategy">
              <Icon cursor="pointer" as={ArrowLeftIcon} />
            </Link>
            <Spacer />
            <Text>DCA in</Text>
            <Spacer />
            <Button>Cancel</Button>
          </Flex>
        </ModalHeader>
        <ModalBody p={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" spacing={4}>
              <FormControl isInvalid={Boolean(errors.quoteDenom)}>
                <FormLabel>How will you fund your first investment?</FormLabel>
                <FormHelperText>
                  <Flex>
                    <Text>Choose between stablecoins or fiat</Text>
                    <Spacer />
                    Available: 0
                  </Flex>
                </FormHelperText>
                <Select placeholder="Select option" {...register('quoteDenom', { required: 'This is required' })}>
                  <option value="ukuji" label="uKUJI" />
                </Select>
                <FormErrorMessage>{errors.quoteDenom && errors.quoteDenom?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.initialDeposit)}>
                <Input placeholder="Choose amount" {...register('initialDeposit', { required: 'This is required' })} />
                <FormErrorMessage>{errors.initialDeposit && errors.initialDeposit?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.baseDenom)}>
                <FormLabel>How will you fund your first investment?</FormLabel>
                <FormHelperText>CALC will purchase this asset for you</FormHelperText>
                <Select placeholder="Select option" {...register('baseDenom', { required: 'This is required' })}>
                  <option value="DEMO">DEMO</option>
                </Select>
                <FormErrorMessage>{errors.baseDenom && errors.baseDenom?.message}</FormErrorMessage>
              </FormControl>
              <Button type="submit" w="full">
                Submit
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
