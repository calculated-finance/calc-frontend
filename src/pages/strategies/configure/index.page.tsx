import { getFlowLayout } from '@components/Layout';
import { useRouter } from 'next/router';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { Formik, FormikHelpers } from 'formik';
import useSteps from '@hooks/useSteps';
import { StepConfig } from 'src/formConfig/StepConfig';
import useStrategy from '@hooks/useStrategy';
import { Strategy } from '@models/Strategy';
import usePageLoad from '@hooks/usePageLoad';
import { getStrategyResultingDenom } from '@helpers/strategy';
import { DcaInFormDataPostPurchase, initialValues, postPurchaseValidationSchema } from '@models/DcaInFormData';
import { useConfigureStrategy } from '@hooks/useConfigureStrategy';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import Submit from '@components/Submit';
import { useChainId } from '@hooks/useChainId';
import { useWallet } from '@hooks/useWallet';
import { PostPurchaseForm } from '@components/Forms/PostPurchaseForm/PostPurchaseForm';
import { generateStrategyDetailUrl } from '@components/TopPanel/generateStrategyDetailUrl';
import { getExistingValues } from './getExistingValues';

export const configureSteps: StepConfig[] = [
  {
    href: '/strategies/configure',
    title: 'Configure Strategy Destination',
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
            autoCompoundStakingRewardsEnabled={false}
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
  const { chainId: chain } = useChainId();
  const { address } = useWallet();

  if (!data || !chain || !address) {
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader
          stepsConfig={configureSteps}
          showStepper={false}
          cancelUrl={generateStrategyDetailUrl(query?.id)}
        />

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
    autoCompoundStakingRewards: initialValues.autoCompoundStakingRewards,
    yieldOption: initialValues.yieldOption,
    reinvestStrategy: initialValues.reinvestStrategy,
    ...getExistingValues(data, chain, address),
  };

  return (
    <NewStrategyModal>
      <NewStrategyModalHeader
        stepsConfig={configureSteps}
        showStepper={false}
        cancelUrl={generateStrategyDetailUrl(query?.id)}
      />
      <ConfigureForm strategy={data} configureStrategyInitialValues={configureStrategyInitialValues} />
    </NewStrategyModal>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
