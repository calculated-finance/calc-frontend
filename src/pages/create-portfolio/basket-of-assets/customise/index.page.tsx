import { Box, Stack, Center, Button, Text, Flex } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import NewStrategyModal, { NewStrategyModalBody, NewStrategyModalHeader } from '@components/NewStrategyModal';
import usePageLoad from '@hooks/usePageLoad';
import useSteps from '@hooks/useSteps';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { FormNames } from 'src/hooks/useDcaInForm';
import useFormSchema from 'src/hooks/useFormSchema';

import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import DenomIcon from '@components/DenomIcon';
import { basketOfAssetsSteps, DcaInFormDataStep2 } from '../../../../models/DcaInFormData';
import steps from '../steps';
import PortfolioName from './PortfolioName';
import { PortfolioDiagram } from '@components/PortfolioDiagram';

function Page() {
  const router = useRouter();
  const {
    actions,
    state: [step2, step1],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 1);

  const { isPageLoading } = usePageLoad();
  const { validate } = useValidation(basketOfAssetsSteps[1]);
  const { nextStep } = useSteps(steps);

  if (!step1) {
    const handleClick = async () => {
      await router.push('/create-strategy/dca-in/assets');
      actions.resetAction();
    };
    return (
      <NewStrategyModal>
        <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
          Customise Strategy
        </NewStrategyModalHeader>
        <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading}>
          <Center>
            {/* Better to link to start of specific strategy */}
            Invalid Data, please&nbsp;
            <Button onClick={handleClick} variant="link">
              restart
            </Button>
          </Center>
        </NewStrategyModalBody>
      </NewStrategyModal>
    );
  }

  const onSubmit = async (data: DcaInFormDataStep2) => {
    await actions.updateAction(data);
    await nextStep();
  };

  const initialValues = step2;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => (
        <NewStrategyModal>
          <NewStrategyModalHeader stepsConfig={steps} resetForm={actions.resetAction}>
            Customise Strategy
          </NewStrategyModalHeader>
          <NewStrategyModalBody stepsConfig={steps} isLoading={isPageLoading && !isSubmitting}>
            <Form autoComplete="off">
              <Stack direction="column" spacing={4}>
                <PortfolioDiagram portfolio={step1.portfolioDenoms} />
                <PortfolioName />
                <Submit>Next</Submit>
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
