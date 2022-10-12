import { Box, Divider, Flex, FormControl, FormErrorMessage, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik, FormikHelpers } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import { StepConfig } from '@components/NewStrategyModal/steps';
import useStrategy from '@hooks/useStrategy';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';
import * as Yup from 'yup';
import useTopUpStrategy from '@hooks/useTopUpStrategy';
import useBalance from '@hooks/useBalance';
import TopUpAmount from './TopUpAmount';

function TopUpDiagram({ quoteDenom, baseDenom }: any) {
  const { name: quoteDenomName } = getDenomInfo(quoteDenom);
  const { name: baseDenomName } = getDenomInfo(baseDenom);
  return (
    <Flex w="full" justifyContent="space-between">
      <HStack>
        <DenomIcon denomName={quoteDenom} />
        <Text>{quoteDenomName}</Text>
      </HStack>
      <Lottie animationData={arrow} loop />
      <HStack>
        <DenomIcon denomName={baseDenom} />
        <Text>{baseDenomName}</Text>
      </HStack>
    </Flex>
  );
}

export const topUpSteps: StepConfig[] = [
  {
    href: '/strategies/[id]/top-up',
    title: 'Top Up Strategy',
  },
  {
    href: '/strategies/[id]/top-up/success',
    title: 'Top Up Successful',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

function Page() {
  const { nextStep } = useSteps(topUpSteps);
  const { query } = useRouter();
  const { data, isLoading } = useStrategy(query?.id as string);
  const { mutate, error, isError } = useTopUpStrategy();

  const { quote_denom, base_denom } = data?.vault.configuration.pair || {};

  const { isPageLoading } = usePageLoad();

  const { displayAmount } = useBalance({
    token: quote_denom,
  });

  const remaining = getDenomInfo(quote_denom).conversion(
    Number(data?.vault.balances.find((balance) => balance.denom === quote_denom)?.amount),
  );

  const validationSchema = Yup.object({
    topUpAmount: Yup.number().label('Top up amount').positive().max(displayAmount).required(),
  });

  const onSubmit = (
    values: Yup.InferType<typeof validationSchema>,
    { setSubmitting }: FormikHelpers<Yup.InferType<typeof validationSchema>>,
  ) =>
    mutate(
      { values, quoteDenom: quote_denom, id: query.id },
      {
        onSuccess: async () => {
          await nextStep();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );

  const initialValues = {
    topUpAmount: '',
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={topUpSteps}>Choose Funding &amp; Assets</NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
                <Stack spacing={2}>
                  <Heading size="sm">Your DCA In {query?.id} Strategy</Heading>
                  <Text textStyle="body-xs">
                    Remaining balance: {remaining} {getDenomInfo(quote_denom).name}
                  </Text>
                  <TopUpDiagram quoteDenom={quote_denom} baseDenom={base_denom} />
                </Stack>
                <Divider />
                <TopUpAmount quoteDenom={quote_denom!} />
                <FormControl isInvalid={isError}>
                  <Submit>Confirm</Submit>
                  <FormErrorMessage>Failed to top up strategy (Reason: {error?.message})</FormErrorMessage>
                </FormControl>
              </Stack>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
