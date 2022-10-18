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
import getStrategyBalance from 'src/pages/create-strategy/dca-in/success/getInitialDenomBalance';
import DcaDiagram from '@components/DcaDiagram';
import TopUpAmount from './TopUpAmount';
import { getResultingDenom } from '../getResultingDenom';
import { getInitialDenom } from '../getInitialDenom';
import { getStrategyType } from '../getStrategyType';

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
  const { isPageLoading } = usePageLoad();

  const { position_type, pair } = data?.vault || {};

  const initialDenom = getInitialDenom(position_type, pair);
  const resultingDenom = getResultingDenom(position_type, pair);

  const { displayAmount } = useBalance({
    token: initialDenom,
  });

  if (!data) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={topUpSteps} showStepper={false}>
          Choose Funding &amp; Assets
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={topUpSteps} isLoading={isLoading || isPageLoading}>
          loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const remaining = getDenomInfo(initialDenom).conversion(getStrategyBalance(data.vault));

  const validationSchema = Yup.object({
    topUpAmount: Yup.number().label('Top up amount').positive().max(displayAmount).required(),
  });

  const onSubmit = (
    values: Yup.InferType<typeof validationSchema>,
    { setSubmitting }: FormikHelpers<Yup.InferType<typeof validationSchema>>,
  ) =>
    mutate(
      { values, initialDenom, id: query.id },
      {
        onSuccess: async () => {
          await nextStep({ strategyId: query.id });
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
          <NewStrategyModalHeader stepsConfig={topUpSteps} showStepper={false}>
            Choose Funding &amp; Assets
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={topUpSteps} isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={6}>
                <Stack spacing={2}>
                  <Heading size="sm">
                    Your {getStrategyType(data?.vault)} {query?.id} Strategy
                  </Heading>
                  <Text textStyle="body-xs">
                    Remaining balance: {remaining} {getDenomInfo(initialDenom).name}
                  </Text>
                  <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
                </Stack>
                <Divider />
                <TopUpAmount initialDenom={initialDenom!} />
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
