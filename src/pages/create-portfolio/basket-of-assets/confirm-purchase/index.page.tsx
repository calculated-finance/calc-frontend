import { Button, Center, FormControl, FormErrorMessage, Stack, useDisclosure, Text, Box } from '@chakra-ui/react';
import Icon from '@components/Icon';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import { CheckedIcon } from '@fusion-icons/react/interface';
import { useRouter } from 'next/router';
import { FormNames, useConfirmForm } from 'src/hooks/useDcaInForm';
import usePageLoad from '@hooks/usePageLoad';
import { Form, Formik, FormikHelpers } from 'formik';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import { TermsModal } from '@components/TermsModal';
import { basketOfAssetsSteps } from '@models/DcaInFormData';
import { useMutation } from '@tanstack/react-query';
import { Strategy } from '@hooks/useStrategies';
import useValidation from '@hooks/useValidation';
import useFormSchema from 'src/hooks/useFormSchema';
import { PortfolioDiagram } from '@components/PortfolioDiagram';
import BadgeButton from '@components/BadgeButton';
import BasketOfAssetsFees from '@components/BasketOfAssetsFees';
import { ExecutionInterval } from '@models/ExecutionIntervals';
import executionIntervalDisplay from 'src/helpers/executionIntervalDisplay';
import YesNoValues from '@models/YesNoValues';
import Fees from '../../../../components/Fees';
import { AgreementCheckbox } from '../../../../components/AgreementCheckbox';

import steps from '../steps';

function InvalidData() {
  const router = useRouter();
  const { actions } = useConfirmForm(FormNames.DcaIn);

  const handleClick = () => {
    actions.resetAction();
    router.push('/create-strategy/dca-in/assets');
  };
  return (
    <Center>
      {/* Better to link to start of specific strategy */}
      Invalid Data, please&nbsp;
      <Button onClick={handleClick} variant="link">
        restart
      </Button>
    </Center>
  );
}

type AgreementForm = {
  acceptedAgreement: boolean;
};

function ConfirmPurchase() {
  const {
    state: [state, step1, step2, step3, step4],
    actions,
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 4);
  const { isPageLoading } = usePageLoad();
  const { nextStep } = useSteps(steps);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { mutate, isError, error } = useMutation<Strategy['id'], Error>((id: any) => '1' as Strategy['id']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { validate } = useValidation(basketOfAssetsSteps[4]);

  const handleSubmit = (values: AgreementForm, { setSubmitting }: FormikHelpers<AgreementForm>) =>
    mutate(undefined, {
      onSuccess: async (strategyId) => {
        await nextStep({
          strategyId,
        });
        // actions.resetAction();
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*  @ts-ignore */}
      <Formik initialValues={{ acceptedAgreement: false }} validate={validate} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <NewStrategyModal>
            <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
              Confirm &amp; Sign
            </NewStrategyModalHeader>
            <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading} isSigning={isSubmitting}>
              {state ? (
                <Form>
                  <Stack spacing={4}>
                    <Box>
                      <Text textStyle="body-xs">Your basket of assets:</Text>
                      <Text lineHeight={8}>
                        Named{' '}
                        <BadgeButton url="customise">
                          <Text>{step2.portfolioName}</Text>
                        </BadgeButton>
                        , your basket of assets is made up of:
                      </Text>
                    </Box>
                    <PortfolioDiagram portfolio={step1.portfolioDenoms} />
                    <Text lineHeight={8}>
                      You can edit the assets{' '}
                      <BadgeButton url="assets">
                        <Text>here</Text>
                      </BadgeButton>
                      .
                    </Text>
                    {step3.rebalanceMode === 'band-based' && (
                      <Box>
                        <Text textStyle="body-xs">Rebalance cadence:</Text>
                        <Text lineHeight={8}>
                          Starting today, when asset balances exceed{' '}
                          <BadgeButton url="rebalance">
                            <Text textTransform="capitalize">{step3.rebalanceDetails}%</Text>
                          </BadgeButton>{' '}
                          of the target allocation, CALC will swap the above assets to ensure you maintain a balanced
                          exposure to risk.
                        </Text>
                      </Box>
                    )}
                    {step3.rebalanceMode === 'time-based' && (
                      <Box>
                        <Text textStyle="body-xs">Rebalance cadence:</Text>
                        <Text lineHeight={8}>
                          Starting today, every{' '}
                          <BadgeButton url="rebalance">
                            <Text textTransform="capitalize">
                              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                              {/* @ts-ignore */}
                              {executionIntervalDisplay[step3.rebalanceInterval as ExecutionInterval][0]}
                            </Text>
                          </BadgeButton>
                          , CALC will swap the above assets to ensure you maintain a balanced exposure to risk.
                        </Text>
                      </Box>
                    )}
                    {step4.copierCharge === YesNoValues.Yes && (
                      <Box>
                        <Text textStyle="body-xs">Management:</Text>
                        <Text lineHeight={8}>
                          You{' '}
                          <BadgeButton url="permissions">
                            <Text>charge management fees</Text>
                          </BadgeButton>{' '}
                          for others to copy this basket. Those fees include:
                          <br /> A{' '}
                          <BadgeButton url="permissions">
                            <Text>{step4.managementFee ?? 0}%</Text>
                          </BadgeButton>{' '}
                          annual management fee,{' '}
                          <BadgeButton url="permissions">
                            <Text>{step4.openingFee ?? 0}%</Text>
                          </BadgeButton>{' '}
                          opening fee,{' '}
                          <BadgeButton url="permissions">
                            <Text>{step4.closingFee ?? 0}%</Text>
                          </BadgeButton>{' '}
                          closing fee, and a{' '}
                          <BadgeButton url="permissions">
                            <Text>{step4.performanceFee ?? 0}%</Text>
                          </BadgeButton>{' '}
                          performance fee, with a{' '}
                          <BadgeButton url="permissions">
                            <Text>{step4.hurdleRate ?? 0}%</Text>
                          </BadgeButton>{' '}
                          hurdle rate.
                        </Text>
                      </Box>
                    )}
                    <BasketOfAssetsFees />
                    <AgreementCheckbox>
                      <Text textStyle="body-xs">
                        I have read and agree to be bound by the{' '}
                        <Button
                          textDecoration="underline"
                          fontWeight="normal"
                          size="xs"
                          display="inline-flex"
                          colorScheme="blue"
                          variant="unstyled"
                          onClick={onOpen}
                        >
                          CALC Terms & Conditions.
                        </Button>
                      </Text>
                    </AgreementCheckbox>
                    <FormControl isInvalid={isError}>
                      <Submit w="full" type="submit" rightIcon={<Icon as={CheckedIcon} stroke="navy" />}>
                        Confirm
                      </Submit>
                      <FormErrorMessage>Failed to create strategy (Reason: {error?.message})</FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Form>
              ) : (
                <InvalidData />
              )}
            </NewStrategyModalBody>
          </NewStrategyModal>
        )}
      </Formik>
      <TermsModal showCheckbox={false} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
ConfirmPurchase.getLayout = getFlowLayout;

export default ConfirmPurchase;
