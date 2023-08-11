import { HStack, VStack, useRadioGroup } from "@chakra-ui/react";
import { StrategyTypes } from "@models/StrategyTypes";
import { CategoryRadioCard } from "./AssetPageStrategyButtons/AssetsPageRefactored";
import { StrategyRadioCard } from "./AssetPageStrategyButtons/StrategyRadioCard";
import { BuySellButtons } from "./AssetPageStrategyButtons/BuySellButtons";


export const categoryButtonOptions = ['Buy strategies', 'Sell strategies'];
export const strategyButtonOptions = {
    in: [StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn],
    out: [StrategyTypes.DCAOut, StrategyTypes.DCAPlusOut, StrategyTypes.WeightedScaleOut],
};


export function CategoryAndStrategyButtonSelectors({ setCategory, setStrategy, categorySelected, strategySelected }: { setCategory: (categorySelected: BuySellButtons) => void; setStrategy: (strategySelected: StrategyTypes) => void; categorySelected: BuySellButtons; strategySelected: StrategyTypes }) {


    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'category',
        defaultValue: categorySelected,
        onChange: (nextValue: BuySellButtons) => setCategory(nextValue),
    });
    const { getRootProps: getStrategyRootProps, getRadioProps: getStrategyRadioProps } = useRadioGroup({
        name: 'strategy',
        defaultValue: strategySelected,
        onChange: (nextValue: StrategyTypes) => {
            setStrategy(nextValue)
        }
    });

    const categoryGroup = getRootProps();
    const strategyGroup = getStrategyRootProps();


    return (
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
    )
}