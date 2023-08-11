import { Center, Stack } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { AssetsForm } from '@components/AssetsForm';
import { useState } from 'react';
import { BuySellButtons } from '@components/AssetPageStrategyButtons/BuySellButtons';
import { getValidationSchema } from '@helpers/assets-page/getValidationSchema';
import { CategoryAndStrategyButtonSelectors } from '@components/CategoryAndStrateyButtonSelectors';
import { StepConfig } from '@formConfig/StepConfig';

export function Assets({ stepsConfig }: { stepsConfig: StepConfig[] }
) {
  const { connected } = useWallet();

  // move to yup
  const [strategySelected, setStrategySelected] = useState(StrategyTypes.DCAIn);

  const [categorySelected, setCategorySelected] = useState(BuySellButtons.Buy);

  const { data: balances } = useBalances();

  // const dcaInForm = useDcaInForm();
  // const dcaPlusForm = useDCAPlusAssetsForm();
  // const weightedScaleForm = useWeightedScaleAssetsForm()

  const { actions, state } = useDcaInForm();

  const validationSchema = getValidationSchema(strategySelected)
  const { validate } = useValidation(validationSchema, { balances });

  // these will be the steps passed down into this componenet
  const { nextStep } = useSteps(stepsConfig)

  const {
    data: { pairs },
  } = usePairs();

  console.log(strategySelected)
  console.log(categorySelected)


  const onSubmit = async (formData: DcaInFormDataStep1) => {
    await actions.updateAction(formData);
    await nextStep();
  };

  if (!pairs) {
    return (
      <ModalWrapper stepsConfig={stepsConfig} reset={actions.resetAction}>
        <Center h={56}>
          <Spinner />
        </Center>
      </ModalWrapper>
    );
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
        <ModalWrapper reset={actions.resetAction} stepsConfig={stepsConfig}>
          <Form autoComplete="off">
            {/* <AssetPageStrategyButtonsRefactored /> */}

            <CategoryAndStrategyButtonSelectors setStrategy={setStrategySelected} categorySelected={categorySelected} strategySelected={strategySelected} setCategory={setCategorySelected} />


            <Stack direction="column" spacing={6}>
              <AssetsForm strategyType={strategySelected} denomsOut={undefined} denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []} />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

