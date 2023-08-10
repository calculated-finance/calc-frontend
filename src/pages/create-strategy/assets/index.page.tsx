import { Box, Center, HStack, Stack, UseRadioProps, VStack, useRadio, useRadioGroup } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1 } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms, orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import { useStepsRefactored } from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { featureFlags } from 'src/constants';
import { useState } from 'react';
import { CategoryRadioCard } from '@components/AssetPageStrategyButtons/AssetsPageRefactored';
import { InitialAndResultingDenoms } from '@components/InitialAndResultingDenoms';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { useWeightedScaleAssetsForm } from '@hooks/useWeightedScaleForm';
import { getIsInStrategy } from '@helpers/assets-page/getIsInStrategy';
import { getValidationSchema } from '@helpers/assets-page/getValidationSchema';
import { getSteps } from '@helpers/assets-page/getSteps';
import { getStrategyInfo } from '@helpers/assets-page/getStrategyInfo';
import { useStrategyInfoStore } from '../dca-in/customise/useStrategyInfo';
import { BuySellButtons } from './BuySellButtons';


export const categoryButtonOptions = ['Buy strategies', 'Sell strategies'];
export const strategyButtonOptions = {
    in: [StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn],
    out: [StrategyTypes.DCAOut, StrategyTypes.DCAPlusOut, StrategyTypes.WeightedScaleOut],
};

function StrategyRadioCard({ buttonClicked, ...props }: { buttonClicked: string | undefined } & UseRadioProps & ChildrenProp) {
    const { getInputProps, getRadioProps } = useRadio(props);
    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                borderWidth={1}
                borderRadius="lg"
                textColor="slategrey"
                borderColor="slategrey"
                _checked={{
                    color: 'brand.200',
                    borderColor: 'brand.200',
                }}
                _hover={{ bgColor: 'transparent' }}
                fontSize={{ base: '10px', sm: '12px' }}
                width={{ base: '108px', sm: 32 }}
            >
                <Center>
                    <HStack>
                        <Box> {props.children}</Box>
                    </HStack>
                </Center>
            </Box>
        </Box>
    );
}


function Assets() {

    const { strategyInfo, setStrategyInfo } = useStrategyInfoStore()

    const {
        data: { pairs },
    } = usePairs();

    const [strategySelected, setStrategySelected] = useState(strategyInfo?.strategyType);
    const [categorySelected, setCategorySelected] = useState(strategyInfo?.transactionType === "buy" ? BuySellButtons.Buy : BuySellButtons.Sell);

    const { connected } = useWallet();
    const { data: balances } = useBalances();

    const dcaInForm = useDcaInForm();
    const dcaPlusForm = useDCAPlusAssetsForm();
    const weightedScaleForm = useWeightedScaleAssetsForm()

    // still want to check this below
    const currentStrategyForm = strategySelected === StrategyTypes.DCAIn ? dcaInForm : strategySelected === StrategyTypes.DCAPlusIn ? dcaPlusForm : weightedScaleForm;
    const { actions, state } = currentStrategyForm;

    const validationSchema = getValidationSchema(strategySelected)
    const { validate } = useValidation(validationSchema, { balances });

    const newSteps = getSteps(strategySelected)
    const { nextStep } = useStepsRefactored(newSteps, strategySelected);

    const onSubmit = async (formData: DcaInFormDataStep1) => {
        await actions.updateAction(formData);
        await nextStep();
    };

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'category',
        defaultValue: categorySelected,
        onChange: (nextValue: BuySellButtons) => setCategorySelected(nextValue),
    });
    const { getRootProps: getStrategyRootProps, getRadioProps: getStrategyRadioProps } = useRadioGroup({
        name: 'strategy',
        defaultValue: strategySelected,
        onChange: (nextValue: StrategyTypes) => {
            setStrategyInfo(getStrategyInfo(nextValue))
            setStrategySelected(nextValue)
        }
    });

    const categoryGroup = getRootProps();
    const strategyGroup = getStrategyRootProps();

    const denomsOut = orderAlphabetically(
        Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) => getDenomInfo(denom)),
    );
    const isInStrategy = getIsInStrategy(strategySelected)

    if (!pairs) {
        return (
            <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
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
        // @ts-ignore 
        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
            {({ values }) => (
                <ModalWrapper reset={actions.resetAction} stepsConfig={newSteps}>
                    {featureFlags.assetPageStrategyButtonsEnabled ? (
                        <VStack spacing={4} pb={6}>
                            <HStack {...categoryGroup} spacing={{ base: 4, sm: 8 }}>
                                {categoryButtonOptions.map((value) => {
                                    const radio = getRadioProps({ value });
                                    return (
                                        <CategoryRadioCard key={value} {...radio} buttonClicked={categorySelected}>
                                            {value}
                                        </CategoryRadioCard>
                                    );
                                })}
                            </HStack>
                            {categorySelected.includes(BuySellButtons.Buy) ? (
                                <HStack {...strategyGroup} spacing={{ base: 1, sm: 2 }}>
                                    {strategyButtonOptions.in.map((value) => {
                                        const radio = getStrategyRadioProps({ value });
                                        return (
                                            <StrategyRadioCard key={value} {...radio} buttonClicked={strategySelected}>
                                                {value}
                                            </StrategyRadioCard>
                                        );
                                    })}
                                </HStack>
                            ) : (
                                <HStack {...strategyGroup} spacing={{ base: 1, sm: 2 }}>
                                    {strategyButtonOptions.out.map((value) => {
                                        const radio = getStrategyRadioProps({ value });
                                        return (
                                            <StrategyRadioCard key={value} {...radio} buttonClicked={strategySelected}>
                                                {value}
                                            </StrategyRadioCard>
                                        );
                                    })}
                                </HStack>
                            )}
                        </VStack>
                    ) : null}
                    <Form autoComplete="off">
                        <Stack direction="column" spacing={6}>
                            <InitialAndResultingDenoms strategyType={strategySelected} denomsOut={isInStrategy ? undefined : denomsOut} denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []} />
                            {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}

                        </Stack>
                    </Form>
                </ModalWrapper>
            )}
        </Formik>

    );
}

Assets.getLayout = getFlowLayout;

export default Assets;
