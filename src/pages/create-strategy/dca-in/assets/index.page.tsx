import { Stack } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import Submit from '@components/Submit';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import { useRouter } from 'next/router';
import DCAInResultingDenom from '@components/DCAInResultingDenom';
import DCAInInitialDenom from '@components/DCAInInitialDenom';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
<<<<<<< HEAD
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import { getPairAddress } from 'src/fixtures/addresses';
import { StrategyInfoProvider } from '../customise/useStrategyInfo';
=======
>>>>>>> db94b77 (fix backward compatibility)

function DcaIn() {
  const { actions, state } = useDcaInForm();
  const {
    data: { pairs },
  } = usePairs();
  const { nextStep } = useSteps(steps);

  const { data } = useBalances();

  const { validate } = useValidation(step1ValidationSchema, { balances: data?.balances });

  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  const router = useRouter();

  if (!pairs) {
    return <ModalWrapper stepsConfig={steps} reset={actions.resetAction} />;
  }

  const initialValues = {
    ...state.step1,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper reset={actions.resetAction} stepsConfig={steps}>
          <Form autoComplete="off">
            <Stack direction="column" spacing={6}>
              <DCAInInitialDenom />
              <DCAInResultingDenom
                denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []}
              />
              <Submit>Next</Submit>
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

function Page() {
  return (
    <StrategyInfoProvider
      strategyInfo={{
        strategyType: StrategyTypes.DCAIn,
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaIn,
      }}
    >
      <DcaIn />
    </StrategyInfoProvider>
  );
}

Page.getLayout = getFlowLayout;

export default Page;
