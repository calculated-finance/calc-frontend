// import { Center, Stack } from '@chakra-ui/react';
// import { getFlowLayout } from '@components/Layout';
// import { DcaInFormDataStep1, step1ValidationSchema } from 'src/models/DcaInFormData';
// import useDcaInForm from 'src/hooks/useDcaInForm';
// import usePairs, { getResultingDenoms, orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
// import { Form, Formik } from 'formik';
// import useValidation from '@hooks/useValidation';
// import useSteps from '@hooks/useSteps';
// import steps from 'src/formConfig/dcaIn';
// import useBalances from '@hooks/useBalances';
// import { ModalWrapper } from '@components/ModalWrapper';
// import getDenomInfo from '@utils/getDenomInfo';
// import { StrategyTypes } from '@models/StrategyTypes';
// import Spinner from '@components/Spinner';
// import { useWallet } from '@hooks/useWallet';
// import { featureFlags } from 'src/constants';
// import { useState } from 'react';
// import { AssetsForm } from '@components/AssetsForm';
// import Submit from '@components/Submit';
// import { StepOneConnectWallet } from '@components/StepOneConnectWallet';
// import { useDCAPlusAssetsForm } from '@hooks/useDcaPlusForm';
// import { useWeightedScaleAssetsForm } from '@hooks/useWeightedScaleForm';
// import { getIsInStrategy } from '@helpers/assets-page/getIsInStrategy';
// import { CategoryAndStrategyButtonSelectors } from '@components/CategoryAndStrateyButtonSelectors';
// import { getValidationSchema } from '@helpers/assets-page/getValidationSchema';
// import { StrategyInfo, useStrategyInfoStore } from '../dca-in/customise/useStrategyInfo';
// import { BuySellButtons } from '../../../components/AssetPageStrategyButtons/BuySellButtons';




// type StrategyFormType = {
//     dcaInForm: string,
//     dcaPlusForm: string,
//     weightedScaleForm: string
// }

// export function Assets() {

//     const {
//         data: { pairs },
//     } = usePairs();

//     // move to yup
//     const [strategySelected, setStrategySelected] = useState(StrategyTypes.DCAIn);

//     const [categorySelected, setCategorySelected] = useState(BuySellButtons.Buy);

//     const { connected } = useWallet();
//     const { data: balances } = useBalances();

//     // const dcaInForm = useDcaInForm();
//     // const dcaPlusForm = useDCAPlusAssetsForm();
//     // const weightedScaleForm = useWeightedScaleAssetsForm()

//     const { actions, state } = useDcaInForm();

//     const validationSchema = getValidationSchema(strategySelected)
//     const { validate } = useValidation(validationSchema, { balances });

//     // these will be the steps passed down into this componenet
//     const { nextStep } = useSteps(steps)

//     const onSubmit = async (formData: DcaInFormDataStep1) => {
//         await actions.updateAction(formData);
//         await nextStep();
//     };


//     // create a component that checks what dca in/out denoms we should render for the user.
//     const denomsOut = orderAlphabetically(
//         Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)])).map((denom) => getDenomInfo(denom)),
//     );
//     const isInStrategy = getIsInStrategy(strategySelected)

//     if (!pairs) {
//         return (
//             <ModalWrapper stepsConfig={steps} reset={actions.resetAction}>
//                 <Center h={56}>
//                     <Spinner />
//                 </Center>
//             </ModalWrapper>
//         );
//     }

//     const initialValues = {
//         ...state.step1,
//         initialDenom: state.step1.initialDenom,
//         resultingDenom: state.step1.resultingDenom,
//     };

//     return (

//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore 
//         <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
//             {({ values }) => (
//                 <ModalWrapper reset={actions.resetAction} stepsConfig={steps}>
//                     <Form autoComplete="off">
//                         {featureFlags.assetPageStrategyButtonsEnabled ? (
//                             <CategoryAndStrategyButtonSelectors setCategory={setCategorySelected} setStrategy={setStrategySelected} strategySelected={strategySelected} categorySelected={categorySelected} />
//                         ) : null}
//                         <Stack direction="column" spacing={6}>
//                             <AssetsForm strategyType={strategySelected} denomsOut={isInStrategy ? undefined : denomsOut} denoms={values.initialDenom ? getResultingDenoms(pairs, getDenomInfo(values.initialDenom)) : []} />
//                             {connected ? <Submit>Next</Submit> : <StepOneConnectWallet />}

//                         </Stack>
//                     </Form>
//                 </ModalWrapper>
//             )}
//         </Formik>

//     );
// }

