import { Box, Center, HStack, Stack, UseRadioProps, VStack, useRadio, useRadioGroup } from '@chakra-ui/react';
import { getFlowLayout } from '@components/Layout';
import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
import useDcaInForm from 'src/hooks/useDcaInForm';
import usePairs, { getResultingDenoms, orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
import { Form, Formik } from 'formik';
import useValidation from '@hooks/useValidation';
import useSteps from '@hooks/useSteps';
import steps from 'src/formConfig/dcaIn';
import useBalances from '@hooks/useBalances';
import { ModalWrapper } from '@components/ModalWrapper';
import { FormNames } from '@hooks/useFormStore';
import getDenomInfo from '@utils/getDenomInfo';
import { StrategyTypes } from '@models/StrategyTypes';
import { TransactionType } from '@components/TransactionType';
import Spinner from '@components/Spinner';
import { useWallet } from '@hooks/useWallet';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { featureFlags } from 'src/constants';
import { useState } from 'react';
import { StrategyInfoProvider, useStrategyInfo } from '../dca-in/customise/useStrategyInfo';
import { BuySellButtons } from './BuySellButtons';
import { CategoryRadioCard } from '@components/AssetPageStrategyButtons/AssetsPageRefactored';
import { InitialAndResultingDenoms } from '@components/InitialAndResultingDenoms';
import Submit from '@components/Submit';
import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
import { useWeightedScaleAssetsForm } from '@hooks/useWeightedScaleForm';
import { DcaPlusAssetsFormSchema } from '@models/dcaPlusFormData';
import { WeightedScaleAssetsFormSchema } from '@models/weightedScaleFormData';


export const categoryButtonOptions = ['Buy strategies', 'Sell strategies'];
export const strategyButtonOptions = {
    in: [StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn],
    out: [StrategyTypes.DCAOut, StrategyTypes.DCAPlusOut, StrategyTypes.WeightedScaleOut],
};

function getIsInStrategy(strategyType: string) {
    if (strategyType === StrategyTypes.DCAIn) {
        return true;
    }
    if (strategyType === StrategyTypes.DCAPlusIn) {
        return true
    }

    if (strategyType === StrategyTypes.WeightedScaleIn) {
        return true
    }

    return false;
}



function StrategyRadioCard({ buttonClicked, ...props }: { buttonClicked: string } & UseRadioProps & ChildrenProp) {
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


function getValidationSchema(strategySelected: string) {

    if (strategySelected === (StrategyTypes.DCAIn || StrategyTypes.DCAOut)) {
        return step1ValidationSchema
    }
    if (strategySelected === (StrategyTypes.DCAPlusIn || StrategyTypes.DCAPlusOut)) {
        return DcaPlusAssetsFormSchema
    }
    return WeightedScaleAssetsFormSchema



}

function Assets() {
    const { connected } = useWallet();
    const {
        data: { pairs },
    } = usePairs();


    console.log(pairs)


    const { nextStep } = useSteps(steps);

    const { data: balances } = useBalances();


    const [strategySelected, setStrategySelected] = useState('DCA In');

    const currentStrategyForm = strategySelected === ('DCA In') ? useDcaInForm() : strategySelected === 'DCA+ In' ? useDCAPlusAssetsForm() : useWeightedScaleAssetsForm();

    const { actions, state } = currentStrategyForm;
    const validationSchema = getValidationSchema(strategySelected)

    const { validate } = useValidation(validationSchema, { balances });
    console.log(currentStrategyForm)
    console.log(state, actions)


    const onSubmit = async (formData: DcaInFormDataStep1) => {
        await actions.updateAction(formData);
        await nextStep();
    };

    const currentStrategyCategory = useStrategyInfo();
    const initialCategorySelected =
        currentStrategyCategory?.transactionType === 'buy' ? BuySellButtons.Buy : BuySellButtons.Sell;
    const [categorySelected, setCategorySelected] = useState(initialCategorySelected);


    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'category',
        defaultValue: initialCategorySelected,
        onChange: (nextValue: BuySellButtons) => setCategorySelected(nextValue),
    });
    const categoryGroup = getRootProps();

    const { getRootProps: getStrategyRootProps, getRadioProps: getStrategyRadioProps } = useRadioGroup({
        name: 'strategy',
        defaultValue: strategySelected,
        onChange: (nextValue: BuySellButtons) => setStrategySelected(nextValue),
    });
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
        //  @ts-ignore
        <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
            {({ values }) => (
                <ModalWrapper reset={actions.resetAction} stepsConfig={steps}>
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

function Page() {
    return (
        <StrategyInfoProvider
            strategyInfo={{
                strategyType: StrategyTypes.DCAIn,
                transactionType: TransactionType.Buy,
                formName: FormNames.DcaIn,
            }}
        >
            <Assets />
        </StrategyInfoProvider>
    );
}

Page.getLayout = getFlowLayout;

export default Page;
