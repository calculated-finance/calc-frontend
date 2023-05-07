import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import { StepConfig } from 'src/formConfig/StepConfig';
import useStrategy from '@hooks/useStrategy';
import { Strategy } from '@hooks/useStrategies';
import usePageLoad from '@hooks/usePageLoad';
import { getStrategyInitialDenom, getStrategyResultingDenom } from '@helpers/strategy';
import { PostPurchaseForm } from '@components/PostPurchaseForm';
import { DcaInFormDataPostPurchase, initialValues, postPurchaseValidationSchema } from '@models/DcaInFormData';
import { useConfigureStrategy } from '@hooks/useConfigureStrategy';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import Submit from '@components/Submit';

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

function ConfigureForm({ strategy }: { strategy: Strategy }) {
  const { nextStep } = useSteps(configureSteps);
  const { isPageLoading } = usePageLoad();

  const { mutate, error, isError } = useConfigureStrategy();

  const resultingDenom = getStrategyResultingDenom(strategy);

  const validationSchema = postPurchaseValidationSchema;

  const onSubmit = (values: DcaInFormDataPostPurchase, { setSubmitting }: FormikHelpers<DcaInFormDataPostPurchase>) => {
    const validatedValues = postPurchaseValidationSchema.cast(values, { stripUnknown: true });
    return mutate(
      { values: validatedValues, strategy },
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

  const configureStrategyInitialValues = {
    postPurchaseOption: initialValues.postPurchaseOption,
    sendToWallet: initialValues.sendToWallet,
    recipientAccount: initialValues.recipientAccount,
    autoStakeValidator: initialValues.autoStakeValidator,
    yieldOption: initialValues.yieldOption,
    reinvestStrategy: initialValues.reinvestStrategy,
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
                <Submit>Confirm</Submit>
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

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader stepsConfig={configureSteps} showStepper={false}>
        Choose Funding &amp; Assets
      </NewStrategyModalHeader>
      {isLoading && (
        <NewStrategyModalBody stepsConfig={configureSteps} isLoading={isLoading}>
          Loading
        </NewStrategyModalBody>
      )}
      {data?.vault && <ConfigureForm strategy={data.vault} />}
    </NewStrategyModal>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
