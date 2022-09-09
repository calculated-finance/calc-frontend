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
  Select,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { NextPageWithLayout } from 'src/pages/_app';
import { useBalance, useWallet } from '@wizard-ui/react';
import DcaInFormData from 'src/types/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModalHeader from '@components/NewStrategyModalHeader';
import usePairs from '@hooks/usePairs';

// eslint-disable-next-line react/function-component-definition
const DcaIn: NextPageWithLayout = () => {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { data, isLoading } = usePairs();

  const onSubmit = (formData: any) => {
    actions.updateAction(formData);
    router.push('/create-strategy/dca-in/step2');
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DcaInFormData>({
    defaultValues: state,
  });

  const watchedQuoteDenom = watch('quoteDenom');

  const { address } = useWallet();
  const { data: amount } = useBalance({
    // This is a hack to make sure quote denom is set
    // TODO: validate form data from previous steps better
    token: watchedQuoteDenom!,
    address,
  });

  return (
    <Modal isOpen onClose={() => {}}>
      <ModalContent>
        <NewStrategyModalHeader backUrl="/create-strategy" resetForm={actions.resetAction} />
        <ModalBody p={4}>
          {isLoading || !data ? (
            <Text>Loading...</Text>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="column" spacing={4}>
                <FormControl isInvalid={Boolean(errors.quoteDenom)}>
                  <FormLabel>How will you fund your first investment?</FormLabel>
                  <FormHelperText>
                    <Flex>
                      <Text>Choose between stablecoins or fiat</Text>
                      <Spacer />
                      {/* eslint-disable-next-line no-nested-ternary */}
                      Available: {amount ? new Intl.NumberFormat().format(amount) : watchedQuoteDenom ? 0 : '-'}
                    </Flex>
                  </FormHelperText>
                  <Select placeholder="Select option" {...register('quoteDenom', { required: 'This is required' })}>
                    {data.pairs?.map((pair: any) => (
                      <option key={pair.address} value={pair.quote_denom} label={pair.quote_denom} />
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.quoteDenom && errors.quoteDenom?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.initialDeposit)} isDisabled={!watchedQuoteDenom}>
                  <Input
                    placeholder="Choose amount"
                    {...register('initialDeposit', {
                      required: 'This is required',
                      max: { value: amount ?? 0, message: 'Value must be less than total funds' },
                    })}
                  />
                  <FormErrorMessage>{errors.initialDeposit && errors.initialDeposit?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.baseDenom)} isDisabled={!watchedQuoteDenom}>
                  <FormLabel>How will you fund your first investment?</FormLabel>
                  <FormHelperText>CALC will purchase this asset for you</FormHelperText>
                  <Select placeholder="Select option" {...register('baseDenom', { required: 'This is required' })}>
                    {data.pairs
                      ?.filter((pair: any) => pair.quote_denom === watchedQuoteDenom)
                      .map((pair: any) => (
                        <option key={pair.address} value={pair.base_denom} label={pair.base_denom} />
                      ))}
                  </Select>
                  <FormErrorMessage>{errors.baseDenom && errors.baseDenom?.message}</FormErrorMessage>
                </FormControl>
                <Button type="submit" w="full">
                  Submit
                </Button>
              </Stack>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
