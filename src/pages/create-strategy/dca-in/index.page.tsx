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
import { useWallet } from '@wizard-ui/react';
import DcaInFormData, { DcaInFormDataStep1 } from 'src/types/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs, { Pair } from '@hooks/usePairs';
import useBalance from '@hooks/useBalance';
import Spinner from '@components/Spinner';
import getDenomInfo from '@utils/getDenomInfo';
import * as Yup from 'yup';
import { Form, Formik, useField, useFormikContext } from 'formik';

function InitialDeposit() {
  const [field, meta] = useField({ name: 'initialDeposit' });

  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.error)} isDisabled={!quoteDenom}>
      <Input placeholder="Choose amount" {...field} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function QuoteDenom() {
  const { data } = usePairs();
  const { pairs } = data || {};
  const [field, meta] = useField({ name: 'quoteDenom' });
  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  const { address } = useWallet();
  const { data: balanceData } = useBalance({
    token: quoteDenom,
    address,
  });

  const amount = balanceData ? Number(balanceData.amount) : 0;

  const availableFunds = amount && new Intl.NumberFormat().format(getDenomInfo(quoteDenom).conversion(amount));

  return (
    <FormControl isInvalid={Boolean(meta.error)}>
      <FormLabel>How will you fund your first investment?</FormLabel>
      <FormHelperText>
        <Flex>
          <Text textStyle="body-xs">Choose between stablecoins or fiat</Text>
          <Spacer />
          {!!quoteDenom && !!amount && <Text textStyle="body-xs">Available: {availableFunds}</Text>}
        </Flex>
      </FormHelperText>
      <SimpleGrid columns={2} spacing={2}>
        <Box>
          <Select placeholder="Select option" {...field}>
            {pairs?.map((pair: Pair) => (
              <option key={pair.address} value={pair.quote_denom} label={getDenomInfo(pair.quote_denom).name} />
            ))}
          </Select>
          <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
        </Box>
        <InitialDeposit />
      </SimpleGrid>
    </FormControl>
  );
}

function BaseDenom() {
  const [field, meta] = useField({ name: 'baseDenom' });
  const { data } = usePairs();
  const { pairs } = data || {};

  const {
    values: { quoteDenom },
  } = useFormikContext<DcaInFormDataStep1>();

  return (
    <FormControl isInvalid={Boolean(meta.error)} isDisabled={!quoteDenom}>
      <FormLabel>What asset do you want to invest in?</FormLabel>
      <FormHelperText>
        <Text textStyle="body-xs">CALC will purchase this asset for you</Text>
      </FormHelperText>
      <Select placeholder="Select option" {...field}>
        {pairs
          ?.filter((pair: Pair) => pair.quote_denom === quoteDenom)
          .map((pair: Pair) => (
            <option key={pair.address} value={pair.base_denom} label={getDenomInfo(pair.base_denom).name} />
          ))}
      </Select>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

function Submit() {
  const { isSubmitting, isValid } = useFormikContext<DcaInFormDataStep1>();
  return (
    <Button isDisabled={!isValid} isLoading={isSubmitting} type="submit" w="full">
      Submit
    </Button>
  );
}

function DcaIn() {
  const router = useRouter();
  const { actions, state } = useDcaInForm();
  const { data: pairsData, isLoading } = usePairs();

  const onSubmit = async (formData: DcaInFormData['step1']) => {
    await actions.updateAction({ ...state, step1: formData });
    await router.push('/create-strategy/dca-in/step2');
  };

  const initialValues = state.step1;

  const validationSchema = Yup.object({
    baseDenom: Yup.string().required(),
    quoteDenom: Yup.string().required(),
    initialDeposit: Yup.number().positive().required(),
  });

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader resetForm={actions.resetAction}>Choose Funding &amp; Assets</NewStrategyModalHeader>
      <NewStrategyModalBody>
        {isLoading || !pairsData ? (
          <Center h={56}>
            <Spinner />
          </Center>
        ) : (
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form>
              <Stack direction="column" spacing={4}>
                <QuoteDenom />
                <BaseDenom />
                <Submit />
              </Stack>
            </Form>
          </Formik>
        )}
      </NewStrategyModalBody>
    </NewStrategyModal>
  );
}

DcaIn.getLayout = getFlowLayout;

export default DcaIn;
