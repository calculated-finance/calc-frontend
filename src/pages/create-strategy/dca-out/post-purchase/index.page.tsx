import { Box, Collapse, FormControl, FormHelperText, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataPostPurchase, postPurchaseValidationSchema } from 'src/models/DcaInFormData';
import { useDcaInFormPostPurchase } from 'src/hooks/useDcaInForm';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import usePageLoad from '@hooks/usePageLoad';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import SendToWallet from './SendToWallet';
import RecipientAccount from './RecipientAccount';
import SendToWalletValues from '../../../../models/SendToWalletValues';
import dcaOutSteps from '../dcaOutSteps';

function Page() {
  const { actions, state } = useDcaInFormPostPurchase();
  const { isLoading } = usePairs();
  const { nextStep } = useSteps(dcaOutSteps);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(postPurchaseValidationSchema);

  const onSubmit = async (formData: DcaInFormDataPostPurchase) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={state} validate={validate} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={dcaOutSteps} resetForm={actions.resetAction}>
            Post Purchase
          </NewStrategyModalHeader>
          <NewStrategyModalBody isLoading={isLoading || (isPageLoading && !isSubmitting)}>
            <Form autoComplete="off">
              <FormControl>
                <Stack direction="column" spacing={6}>
                  <SendToWallet />
                  <FormHelperText>
                    <HStack>
                      <Text>Multiple transactions supported by</Text>
                      <Image src="/images/kujiraLogo.svg" /> <Text>(Coming soon)</Text>
                    </HStack>
                  </FormHelperText>
                  <Collapse in={values.sendToWallet === SendToWalletValues.No}>
                    <Box m="px">
                      <RecipientAccount />
                    </Box>
                  </Collapse>
                  <Submit>Next</Submit>
                </Stack>
              </FormControl>
            </Form>
          </NewStrategyModalBody>
        </NewStrategyModal>
      )}
    </Formik>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
