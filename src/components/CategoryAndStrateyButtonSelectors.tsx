import { HStack, VStack, useRadioGroup } from '@chakra-ui/react';
import { StrategyTypes } from '@models/StrategyTypes';
import { useField } from 'formik';
import { useState } from 'react';
import { StrategyRadioCard } from './AssetPageStrategyButtons/StrategyRadioCard';
import { BuySellButtons } from './AssetPageStrategyButtons/BuySellButtons';
import { CategoryRadioCard } from './AssetPageStrategyButtons/index-old';

export const categoryButtonOptions = ['Buy strategies', 'Sell strategies'];
export const strategyButtonOptions = {
  in: [StrategyTypes.DCAIn, StrategyTypes.DCAPlusIn, StrategyTypes.WeightedScaleIn],
  out: [StrategyTypes.DCAOut, StrategyTypes.DCAPlusOut, StrategyTypes.WeightedScaleOut],
};

export function CategoryAndStrategyButtonSelectors() {
  const [field, meta, helpers] = useField({ name: 'strategyType' });
  const [, , initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [, , initialDepositHelpers] = useField({ name: 'initialDeposit' });
  const [, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });

  const buySellButtonValue = strategyButtonOptions.in.includes(field.value) ? BuySellButtons.Buy : BuySellButtons.Sell;

  const [categorySelected, setCategorySelected] = useState(buySellButtonValue);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: categorySelected,
    onChange: (nextValue: BuySellButtons) => {
      setCategorySelected(nextValue);
    },
  });

  const { getRootProps: getStrategyRootProps, getRadioProps: getStrategyRadioProps } = useRadioGroup({
    name: 'strategy',
    defaultValue: field.value,
    onChange: (nextValue: StrategyTypes) => {
      // TODO: is there a better way to do this?
      initialDenomHelpers.setValue('');
      //   initialDepositHelpers.setValue(null);
      resultingDenomHelpers.setValue('');

      initialDenomHelpers.setTouched(false);
      initialDepositHelpers.setTouched(true);
      resultingDenomHelpers.setTouched(false);

      helpers.setValue(nextValue);
    },
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
              <StrategyRadioCard key={value} {...radio} buttonClicked={field.value}>
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
              <StrategyRadioCard key={value} {...radio} buttonClicked={field.value}>
                {value}
              </StrategyRadioCard>
            );
          })}
        </HStack>
      )}
    </VStack>
  );
}
