import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import { StepConfig } from 'src/formConfig/StepConfig';
import useStrategy from '@hooks/useStrategy';
import { Strategy, StrategyOsmosis } from '@hooks/useStrategies';
import usePageLoad from '@hooks/usePageLoad';
import { getStrategyResultingDenom } from '@helpers/strategy';
import { PostPurchaseForm } from '@components/PostPurchaseForm';
import { DcaInFormDataPostPurchase, initialValues, postPurchaseValidationSchema } from '@models/DcaInFormData';
import { useConfigureStrategy } from '@hooks/useConfigureStrategy';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import Submit from '@components/Submit';
import { useChain } from '@hooks/useChain';
import { useWallet } from '@hooks/useWallet';
import { getExistingValues } from './getExistingValues';

export const configureSteps: StepConfig[] = [
  {
    href: '/strategies/configure',
    title: 'Configure Strategy',
  },
  {
    href: '/strategies/configure/success',
    title: 'Configure Successful',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

function ConfigureForm({
  strategy,
  configureStrategyInitialValues,
}: {
  strategy: Strategy;
  configureStrategyInitialValues: DcaInFormDataPostPurchase;
}) {
  const { nextStep } = useSteps(configureSteps);
  const { isPageLoading } = usePageLoad();

  const { mutate, error, isError } = useConfigureStrategy();

  const resultingDenom = getStrategyResultingDenom(strategy);

  const validationSchema = postPurchaseValidationSchema;

  const onSubmit = (values: DcaInFormDataPostPurchase, { setSubmitting }: FormikHelpers<DcaInFormDataPostPurchase>) => {
    const validatedValues = postPurchaseValidationSchema.cast(values, { stripUnknown: true });
    return mutate(
      { values: validatedValues as DcaInFormDataPostPurchase, strategy },
      {
        onSuccess: async () => {
          await nextStep({
            strategyId: strategy.id,
          });
        },
        onSettled: () => {
          setSubmitting(false);
        },
      },
    );
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={configureStrategyInitialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isPageLoading} isSigning={isSubmitting}>
          <PostPurchaseForm
            resultingDenom={resultingDenom}
            submitButton={
              <FormControl isInvalid={isError}>
                <Submit disabledUnlessDirty>Confirm</Submit>
                <FormErrorMessage>Failed to update strategy (Reason: {error?.message})</FormErrorMessage>
              </FormControl>
            }
          />
        </NewStrategyModalBody>
      )}
    </Formik>
  );
}

function Page() {
  const { query } = useRouter();
  const { data, isLoading } = useStrategy(query?.id as string);
  const { chain } = useChain();
  const { address } = useWallet();

  if (!data?.vault || !chain || !address) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={configureSteps} showStepper={false} />

        <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isLoading}>
          Loading
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const configureStrategyInitialValues = {
    postPurchaseOption: initialValues.postPurchaseOption,
    sendToWallet: initialValues.sendToWallet,
    recipientAccount: initialValues.recipientAccount,
    autoStakeValidator: initialValues.autoStakeValidator,
    yieldOption: initialValues.yieldOption,
    reinvestStrategy: initialValues.reinvestStrategy,
    ...getExistingValues(data.vault as unknown as StrategyOsmosis, chain, address),
  };

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={configureSteps} showStepper={false} />
      <ConfigureForm strategy={data.vault} configureStrategyInitialValues={configureStrategyInitialValues} />
    </NewStrategyModal>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
