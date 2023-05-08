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
import DcaDiagram from '@components/DcaDiagram';
import { Strategy } from '@hooks/useStrategies';
import usePageLoad from '@hooks/usePageLoad';
import getStrategyBalance, {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  getStrategyName,
} from '@helpers/strategy';
import { getTimeSaved } from '@helpers/getTimeSaved';
import { DcaPlusTopUp } from '@components/helpContent/DcaPlusTopUp';
import { isDcaPlus } from '@helpers/strategy/isDcaPlus';
import TopUpAmount from './TopUpAmount';

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

export const dcaPlusTopUpSteps: StepConfig[] = [
  {
    href: '/strategies/top-up',
    title: 'Top Up Strategy',
    footerText: 'How does the strategy change once you top-up the balance?',
    helpContent: <DcaPlusTopUp />,
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
  const steps = isDcaPlus(strategy) ? dcaPlusTopUpSteps : topUpSteps;
  const { nextStep } = useSteps(steps);
  const { isPageLoading } = usePageLoad();

  const { mutate, error, isError } = useTopUpStrategy();

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const { displayAmount } = useBalance({
    token: initialDenom,
  });

  const remaining = getStrategyBalance(strategy);

  const validationSchema = Yup.object({
    topUpAmount: Yup.number().label('Top up amount').positive().max(displayAmount).required(),
  });

  const onSubmit = (
    values: Yup.InferType<typeof validationSchema>,
    { setSubmitting }: FormikHelpers<Yup.InferType<typeof validationSchema>>,
  ) =>
    mutate(
      { values, initialDenom, strategy },
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
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isSubmitting}>
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
              <TopUpAmount strategy={strategy} />
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
  const { data } = useStrategy(query?.id as string);

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
