import { Center, FormControl, Stack } from '@chakra-ui/react';
import { useAssetsForm } from 'src/hooks/useDcaInForm';
import usePairs from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { StrategyType } from '@models/StrategyType';
import Spinner from '@components/Spinner';
import { CategoryAndStrategyButtonSelectors } from '@components/CategoryAndStrategyButtonSelectors';
import { FormNames } from '@hooks/useFormStore';
import { routerPush } from '@helpers/routerPush';
import { getSteps } from '@helpers/assets-page/getSteps';
import { useStrategyInfo } from '@hooks/useStrategyInfo';
import { useRouter } from 'next/router';
import { BrowserRouter } from 'react-router-dom';
import { AssetsFormValues, assetsFormSchema } from '@models/DcaInFormData';
import { AssetsForm } from './AssetsForm';

const strategyTypesToFormTypes = {
  [StrategyType.SimpleDCAIn]: FormNames.SimpleDcaIn,
  [StrategyType.DCAIn]: FormNames.DcaIn,
  [StrategyType.DCAOut]: FormNames.DcaOut,
  [StrategyType.DCAPlusIn]: FormNames.DcaPlusIn,
  [StrategyType.DCAPlusOut]: FormNames.DcaPlusOut,
  [StrategyType.WeightedScaleIn]: FormNames.WeightedScaleIn,
  [StrategyType.WeightedScaleOut]: FormNames.WeightedScaleOut,
  [StrategyType.StreamingSwap]: FormNames.StreamingSwap,
};

const CUSTOMISE_PAGE_INDEX = 1;

export function Assets() {
  const { strategyType } = useStrategyInfo();
  const stepsConfig = getSteps(strategyType);
  const { balances } = useBalances();

  const { validate } = useValidation(assetsFormSchema, { balances });

  const { state, actions } = useAssetsForm();
  const router = useRouter();

  const { pairs } = usePairs();

  const onSubmit = (formData: AssetsFormValues) => {
    const formName = strategyTypesToFormTypes[formData.strategyType];
    actions.updateAction(formName)(formData);
    const currentSteps = getSteps(formData.strategyType);
    routerPush(router, currentSteps[CUSTOMISE_PAGE_INDEX].href);
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

  const initialValues: any = {
    ...state.step1,
    strategyType,
    initialDenom: state.step1.initialDenom,
    resultingDenom: state.step1.resultingDenom,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <BrowserRouter>
      <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
        <ModalWrapper reset={actions.resetAction} stepsConfig={stepsConfig}>
          <Form autoComplete="off">
            <FormControl>
              <CategoryAndStrategyButtonSelectors />
            </FormControl>
            <Stack direction="column" spacing={6}>
              <AssetsForm />
            </Stack>
          </Form>
        </ModalWrapper>
      </Formik>
    </BrowserRouter>
  );
}
