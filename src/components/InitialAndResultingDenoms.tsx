import {
    Box,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    SimpleGrid,
    Spacer,
    Text,
    Center,
} from '@chakra-ui/react';
import usePairs, { orderAlphabetically, uniqueBaseDenoms, uniqueQuoteDenoms } from '@hooks/usePairs';
import getDenomInfo, { isDenomStable } from '@utils/getDenomInfo';
import { useField, useFormikContext } from 'formik';
import { AvailableFunds } from '@components/AvailableFunds';
import { DenomSelect } from '@components/DenomSelect';
import InitialDeposit from '@components/InitialDeposit';
import { useChain } from '@hooks/useChain';
import { DenomInfo } from '@utils/DenomInfo';
import { getChainDexName } from '@helpers/chains';
import { StrategyTypes } from '@models/StrategyTypes';
import { DcaInFormDataStep1 } from '@models/DcaInFormData';

// we can use this for now but can get this through the state of buttons selected - we can discuss.
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


export function InitialAndResultingDenoms({ denomsOut, denoms, strategyType }: { denomsOut: DenomInfo[] | undefined; denoms: DenomInfo[]; strategyType: string }) {
    const { data } = usePairs();
    const { pairs } = data || {};
    const [field, meta, helpers] = useField({ name: 'initialDenom' });
    const { chain } = useChain();

    const denomsIn = orderAlphabetically(
        Array.from(new Set([...uniqueBaseDenoms(pairs), ...uniqueQuoteDenoms(pairs)]))
            .map((denom) => getDenomInfo(denom))
            .filter(isDenomStable),
    );
    const [resultingField, resultingMeta, resultingHelpers] = useField({ name: 'resultingDenom' });
    const { chain: resultingChain } = useChain();

    const {
        values: { initialDenom },
    } = useFormikContext<DcaInFormDataStep1>();


    if (!pairs) {
        return null;
    }

    const isInStrategy = getIsInStrategy(strategyType)


    return (
        <>
            <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
                <FormLabel>{!denomsOut ? 'How will you fund your first investment?' : 'What position do you want to take profit on?'}</FormLabel>
                <FormHelperText>
                    <Center>
                        <Text textStyle="body-xs">{!denomsOut ? 'Choose stablecoin' : `CALC currently supports pairs trading on ${getChainDexName(chain)}.`} </Text>
                        <Spacer />
                        {field.value && <AvailableFunds denom={getDenomInfo(field.value)} />}
                    </Center>
                </FormHelperText>

                <SimpleGrid columns={2} spacing={2}>
                    <Box>
                        <DenomSelect
                            denoms={!denomsOut ? denomsIn : denomsOut}
                            placeholder="Choose&nbsp;asset"
                            value={field.value}
                            onChange={helpers.setValue}
                            showPromotion
                            optionLabel={getChainDexName(chain)}

                        />
                        <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
                    </Box>
                    <InitialDeposit />
                </SimpleGrid>
            </FormControl>

            <FormControl isInvalid={Boolean(resultingMeta.touched && resultingMeta.error)} isDisabled={!initialDenom}>
                <FormLabel hidden={!isInStrategy}>What asset do you want to invest in?</FormLabel>
                <FormLabel hidden={isInStrategy}>How do you want to hold your profits?</FormLabel>

                <FormHelperText>
                    <Text textStyle="body-xs">{isInStrategy ? 'CALC will purchase this asset for you' : 'You will have the choice to move these funds into another strategy at the end.'}</Text>
                </FormHelperText>
                <DenomSelect
                    denoms={denoms}
                    placeholder="Choose asset"
                    value={resultingField.value}
                    onChange={resultingHelpers.setValue}
                    optionLabel={`Swapped on ${getChainDexName(resultingChain)}`}
                />
                <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
            </FormControl>
        </>
    )

}
