import { Center, FormControl, Stack } from '@chakra-ui/react';
import { getFormState } from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { AssetsForm } from '@components/AssetsForm';
import { CategoryAndStrategyButtonSelectors } from '@components/CategoryAndStrateyButtonSelectors';
import { StepConfig } from '@formConfig/StepConfig';
import * as Yup from 'yup';
import { Coin } from 'src/interfaces/generated-osmosis/response/get_vault';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import { routerPush } from '@helpers/routerPush';
import { getSteps } from '@helpers/assets-page/getSteps';
import { useRouter } from 'next/router';
import { isNil } from 'lodash';
import { DCA_PLUS_MIN_SWAP_COEFFICIENT, MIN_DCA_PLUS_STRATEGY_DURATION } from 'src/constants';
import { useStrategyInfo } from '../dca-in/customise/useStrategyInfo';

const strategyTypesToFormTypes = {
  [StrategyTypes.DCAIn]: FormNames.DcaIn,
  [StrategyTypes.DCAOut]: FormNames.DcaOut,
  [StrategyTypes.DCAPlusIn]: FormNames.DcaPlusIn,
  [StrategyTypes.DCAPlusOut]: FormNames.DcaPlusOut,
  [StrategyTypes.WeightedScaleIn]: FormNames.WeightedScaleIn,
  [StrategyTypes.WeightedScaleOut]: FormNames.WeightedScaleOut,
};

const assetsFormInitialValues = {
  strategyType: '',
  resultingDenom: '',
  initialDenom: '',
  initialDeposit: null,
};

const assetsFormSchema = Yup.object({
  strategyType: Yup.mixed<StrategyTypes>().required(),
  resultingDenom: Yup.string().label('Resulting Denom').required(),
  initialDenom: Yup.string().label('Initial Denom').required(),
  initialDeposit: Yup.number()
    .label('Initial Deposit')
    .positive()
    .required()
    .nullable()
    .test({
      name: 'less-than-deposit',
      message: ({ label }) => `${label} must be less than or equal to than your current balance`,
      test(value, context) {
        const { balances } = context?.options?.context || {};
        if (!balances || !value || value <= 0) {
          return true;
        }
        const amount = balances.find((balance: Coin) => balance.denom === context.parent.initialDenom)?.amount;
        if (!amount) {
          return false;
        }
        return value <= getDenomInfo(context.parent.initialDenom).conversion(Number(amount));
      },
    })
    .test({
      name: 'greater-than-minimum-deposit',
      test(value, context) {
        if (isNil(value)) {
          return true;
        }
        const { initialDenom = null, strategyType = null } = { ...context.parent, ...context.options.context };
        if (!initialDenom) {
          return true;
        }

        if (strategyType !== StrategyTypes.DCAPlusIn && strategyType !== StrategyTypes.DCAPlusOut) {
          return true;
        }
        const { minimumSwapAmount = 0 } = getDenomInfo(initialDenom);

        const dcaPlusMinimumDeposit =
          minimumSwapAmount * DCA_PLUS_MIN_SWAP_COEFFICIENT * MIN_DCA_PLUS_STRATEGY_DURATION;

        if (value > dcaPlusMinimumDeposit) {
          return true;
        }

        return context.createError({
          message: `Initial deposit must be more than ${dcaPlusMinimumDeposit} ${getDenomName(
            getDenomInfo(initialDenom),
          )}, otherwise the minimum swap amount will decay performance. We recommend depositing at least $50 worth of assets.`,
        });
      },
    }),
});

export type AssetsFormValues = Yup.InferType<typeof assetsFormSchema>;

export const useAssetsForm = () => {
  const { formName } = useStrategyInfo();
  const { address } = useWallet();
  const { forms: state, updateForm: updateAction, resetForm: resetAction } = useFormStore();

  try {
    return {
      state: {
        step1: assetsFormSchema.validateSync(getFormState(state, formName), { stripUnknown: true }),
      },
      actions: {
        updateAction: (currentFormName: FormNames) => updateAction(currentFormName, address),
        resetAction: resetAction(formName),
      },
    };
  } catch (e) {
    return {
      state: {
        step1: assetsFormSchema.cast(assetsFormInitialValues, { stripUnknown: true }),
      },
      actions: {
        updateAction: (currentFormName: FormNames) => updateAction(currentFormName, address),
        resetAction: resetAction(formName),
      },
    };
  }
};

const CUSTOMISE_PAGE_INDEX = 1;

export function Assets({ stepsConfig, strategyType }: { stepsConfig: StepConfig[]; strategyType: StrategyTypes }) {
  const { connected } = useWallet();

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
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ values }) => (
        <ModalWrapper reset={actions.resetAction} stepsConfig={stepsConfig}>
          <Form autoComplete="off">
            {/* <AssetPageStrategyButtonsRefactored /> */}
            <FormControl>
              <CategoryAndStrategyButtonSelectors />
            </FormControl>
            <Stack direction="column" spacing={6}>
              <AssetsForm />
              {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}
            </Stack>
          </Form>
        </ModalWrapper>
      )}
    </Formik>
  );
}
