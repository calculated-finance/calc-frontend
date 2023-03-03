import { Divider, FormControl, FormErrorMessage, Heading, Stack, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Form, Formik, FormikHelpers } from 'formik';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import { StepConfig } from 'src/formConfig/StepConfig';
import useStrategy from '@hooks/useStrategy';
import getDenomInfo from '@utils/getDenomInfo';
import * as Yup from 'yup';
import useTopUpStrategy from '@hooks/useTopUpStrategy';
import useBalance from '@hooks/useBalance';
import getStrategyBalance from 'src/helpers/getStrategyBalance';
import DcaDiagram from '@components/DcaDiagram';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyName } from 'src/helpers/getStrategyName';
import usePageLoad from '@hooks/usePageLoad';
import TopUpAmount from './TopUpAmount';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { getTimeSaved } from '../../../helpers/getTimeSaved';

export const topUpSteps: StepConfig[] = [
  {
    href: '/strategies/top-up',
    title: 'Top Up Strategy',
  },
  {
    href: '/strategies/top-up/success',
    title: 'Top Up Successful',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

function TopUpForm({ strategy }: { strategy: Strategy }) {
  const { nextStep } = useSteps(topUpSteps);
  const { isPageLoading } = usePageLoad();

  const { mutate, error, isError } = useTopUpStrategy();

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);
  const convertedSwapAmount = Number(getDenomInfo(strategy.balance.denom).conversion(Number(strategy.swap_amount)).toFixed(6));

  const { displayAmount } = useBalance({
    token: initialDenom,
  });

  const remaining = getDenomInfo(initialDenom).conversion(getStrategyBalance(strategy));

  const validationSchema = Yup.object({
    topUpAmount: Yup.number().label('Top up amount').positive().max(displayAmount).required(),
  });

  const onSubmit = (
    values: Yup.InferType<typeof validationSchema>,
    { setSubmitting }: FormikHelpers<Yup.InferType<typeof validationSchema>>,
  ) =>
    mutate(
      { values, initialDenom, id: strategy.id },
      {
        onSuccess: async () => {
          await nextStep({
            strategyId: strategy.id,
            timeSaved: getTimeSaved(values.topUpAmount, parseFloat(strategy.swap_amount)),
          });
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
        <NewStrategyModalBody stepsConfig={topUpSteps} isLoading={isPageLoading} isSigning={isSubmitting}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <Stack spacing={2}>
                <Heading size="sm">{getStrategyName(strategy)}</Heading>
                <Text textStyle="body-xs">
                  Remaining balance: {remaining} {getDenomInfo(initialDenom).name}
                </Text>
                <DcaDiagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
              </Stack>
              <Divider />
              <TopUpAmount initialDenom={initialDenom} convertedSwapAmount={convertedSwapAmount}/>
              <FormControl isInvalid={isError}>
                <Submit>Confirm</Submit>
                <FormErrorMessage>Failed to top up strategy (Reason: {error?.message})</FormErrorMessage>
              </FormControl>
            </Stack>
          </Form>
        </NewStrategyModalBody>
      )}
    </Formik>
  );
}

function Page() {
  const { query } = useRouter();
  const { data, isLoading } = useStrategy(query?.id as string);

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={topUpSteps} showStepper={false}>
        Choose Funding &amp; Assets
      </NewStrategyModalHeader>
      {data?.vault && <TopUpForm strategy={data.vault} />}
    </NewStrategyModal>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
