import { Center, FormControl, Stack } from '@chakra-ui/react';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik, useField } from 'formik';
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
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { useWeightedScaleAssetsForm } from '@hooks/useWeightedScaleForm';
import { useStrategyInfo } from '../dca-in/customise/useStrategyInfo';


function useForms(currentStrategy: StrategyTypes) {


  const dcaInForm = useDcaInForm();
  const dcaPlusForm = useDCAPlusAssetsForm();
  const weightedScaleForm = useWeightedScaleAssetsForm()


  if (currentStrategy === StrategyTypes.DCAIn || StrategyTypes.DCAOut || StrategyTypes
    .DCAPlusOut || StrategyTypes.WeightedScaleOut) {
    console.log('dca in, dca out, dca plus out, ws out')
    return dcaInForm
  }
  if (currentStrategy === StrategyTypes.DCAPlusIn) {
    console.log('dca plus in')
    return dcaPlusForm
  }

  console.log('ws in')
  return weightedScaleForm
}

export function Assets({ stepsConfig, strategyType }: { stepsConfig: StepConfig[]; strategyType: StrategyTypes }
) {
  const { connected } = useWallet();

  const [categorySelected, setCategorySelected] = useState(BuySellButtons.Buy);

  const xx = useStrategyInfo()
  console.log(xx, 123)


  const { data: balances } = useBalances();

  // const [meta, helpers] = useField({ name: 'strategyType' })
  // console.log(meta)
  // const form = useForms(strategyType)
  // console.log('form', form)

  // const { actions, state } = useDcaInForm()
  // const { actions, state } = form

  const dcaInForm = useDcaInForm();
  const dcaPlusForm = useDCAPlusAssetsForm();
  const weightedScaleForm = useWeightedScaleAssetsForm()

  // const form = strategyType === StrategyTypes.DCAIn ? dcaInForm : strategyType === StrategyTypes.DCAPlusIn ? dcaPlusForm : weightedScaleForm

  const { actions, state } = dcaInForm

  console.log(state.step1.strategyType)

  const validationSchema = getValidationSchema(state.step1.strategyType)

  const { validate } = useValidation(validationSchema, { balances });

  // these will be the steps passed down into this componenet
  const { nextStep } = useSteps(stepsConfig)

  const {
    data: { pairs },
  } = usePairs();

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
    strategyType,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
  };

  console.log(initialValues)

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper reset={actions.resetAction} stepsConfig={stepsConfig}>
          <Form autoComplete="off">
            {/* <AssetPageStrategyButtonsRefactored /> */}
            <FormControl>
              <CategoryAndStrategyButtonSelectors categorySelected={categorySelected} setCategory={setCategorySelected} />
            </FormControl>
            <Stack direction="column" spacing={6}>
              <AssetsForm strategyType={StrategyTypes.DCAIn} denomsOut={undefined} denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []} />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}

