import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useWallet } from '@wizard-ui/react';
import DcaInFormData from 'src/types/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs, { Pair } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import Spinner from '@components/Spinner';
import getDenomInfo from '@utils/getDenomInfo';

function DcaIn() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { data: pairsData, isLoading } = usePairs();

  const onSubmit = async (formData: DcaInFormData['step1']) => {
    await actions.updateAction({ ...state, step1: formData });
    await router.push('/create-strategy/dca-in/step2');
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DcaInFormData['step1']>({
    defaultValues: state.step1,
  });

  const watchedQuoteDenom = watch('quoteDenom');

  const { address } = useWallet();
  const { data: balanceData } = useBalance({
    token: watchedQuoteDenom,
    address,
  });

  const amount = balanceData ? Number(balanceData.amount) : 0;

  const availableFunds = amount && new Intl.NumberFormat().format(getDenomInfo(watchedQuoteDenom).conversion(amount));

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Choose Funding &amp; Assets</NewStrategyModalHeader>
      <NewStrategyModalBody>
        {isLoading || !pairsData ? (
          <Center h={56}>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" spacing={4}>
              <FormControl isInvalid={Boolean(errors.quoteDenom)}>
                <FormLabel>How will you fund your first investment?</FormLabel>
                <FormHelperText>
                  <Flex>
                    <Text textStyle="body-xs">Choose between stablecoins or fiat</Text>
                    <Spacer />
                    {!!watchedQuoteDenom && !!amount && <Text textStyle="body-xs">Available: {availableFunds}</Text>}
                  </Flex>
                </FormHelperText>
                <SimpleGrid columns={2} spacing={2}>
                  <Box>
                    <Select placeholder="Select option" {...register('quoteDenom', { required: 'This is required' })}>
                      {pairsData.pairs?.map((pair: Pair) => (
                        <option
                          key={pair.address}
                          value={pair.quote_denom}
                          label={getDenomInfo(pair.quote_denom).name}
                        />
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.quoteDenom && errors.quoteDenom?.message}</FormErrorMessage>
                  </Box>
                  <FormControl isInvalid={Boolean(errors.initialDeposit)} isDisabled={!watchedQuoteDenom}>
                    <Input
                      placeholder="Choose amount"
                      {...register('initialDeposit', {
                        required: 'This is required',
                        max: {
                          value: getDenomInfo(watchedQuoteDenom).conversion(amount) ?? 0,
                          message: 'Value must be less than total funds',
                        },
                      })}
                    />
                    <FormErrorMessage>{errors.initialDeposit && errors.initialDeposit?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.baseDenom)} isDisabled={!watchedQuoteDenom}>
                <FormLabel>What asset do you want to invest in?</FormLabel>
                <FormHelperText>
                  <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
                </FormHelperText>
                <Select placeholder="Select option" {...register('baseDenom', { required: 'This is required' })}>
                  {pairsData.pairs
                    ?.filter((pair: Pair) => pair.quote_denom === watchedQuoteDenom)
                    .map((pair: Pair) => (
                      <option key={pair.address} value={pair.base_denom} label={getDenomInfo(pair.base_denom).name} />
                    ))}
                </Select>
                <FormErrorMessage>{errors.baseDenom && errors.baseDenom?.message}</FormErrorMessage>
              </FormControl>
              <Button isLoading={isSubmitting} type="submit" w="full">
                Submit
              </Button>
            </Stack>
          </form>
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
