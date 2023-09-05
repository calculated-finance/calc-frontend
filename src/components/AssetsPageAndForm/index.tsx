import { Center, FormControl, Stack } from '@chakra-ui/react';
import { useAssetsForm } from 'src/hooks/useDcaInForm';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { CategoryAndStrategyButtonSelectors } from '@components/CategoryAndStrateyButtonSelectors';
import { FormNames } from '@hooks/useFormStore';
import { routerPush } from '@helpers/routerPush';
import { getSteps } from '@helpers/assets-page/getSteps';
import { useStrategyInfo } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { useRouter } from 'next/router';
import { AssetsFormValues, assetsFormSchema } from '@models/DcaInFormData';
import { AssetsForm } from './AssetsForm';

const strategyTypesToFormTypes = {
  [StrategyTypes.DCAIn]: FormNames.DcaIn,
  [StrategyTypes.DCAOut]: FormNames.DcaOut,
  [StrategyTypes.DCAPlusIn]: FormNames.DcaPlusIn,
  [StrategyTypes.DCAPlusOut]: FormNames.DcaPlusOut,
  [StrategyTypes.WeightedScaleIn]: FormNames.WeightedScaleIn,
  [StrategyTypes.WeightedScaleOut]: FormNames.WeightedScaleOut,
};

const CUSTOMISE_PAGE_INDEX = 1;

// { stepsConfig, strategyType }: { stepsConfig: StepConfig[]; strategyType: StrategyTypes }

export function Assets() {
  const { connected } = useWallet();
  const { strategyType } = useStrategyInfo();
  const stepsConfig = getSteps(strategyType);
  const { data: balances } = useBalances();

  const { validate } = useValidation(assetsFormSchema, { balances });

  const { state, actions } = useAssetsForm();
  const router = useRouter();

  const {
    data: { pairs },
  } = usePairs();

  const onSubmit = async (formData: AssetsFormValues) => {
    const formName = strategyTypesToFormTypes[formData.strategyType];
    await actions.updateAction(formName)(formData);

    const currentSteps = getSteps(formData.strategyType);

    await routerPush(router, currentSteps[CUSTOMISE_PAGE_INDEX].href);
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

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      <ModalWrapper reset={actions.resetAction} stepsConfig={stepsConfig}>
        <Form autoComplete="off">
          <FormControl>
            <CategoryAndStrategyButtonSelectors />
          </FormControl>
          <Stack direction="column" spacing={6}>
            <AssetsForm />
            {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
          </Stack>
        </Form>
      </ModalWrapper>
    </Formik>
  );
}
