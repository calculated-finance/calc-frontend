import { HStack, VStack, useRadioGroup } from '@chakra-ui/react';
import { StrategyType } from '@models/StrategyType';
import { useField } from 'formik';
import { useState } from 'react';
import { StrategyRadioCard } from './AssetsPageAndForm/AssetPageStrategyButtons/StrategyRadioCard';
import { CategoryRadioCard } from './AssetsPageAndForm/AssetPageStrategyButtons';
import { DcaDirection } from './AssetsPageAndForm/AssetPageStrategyButtons/DcaCategory';

const categoryButtonOptions = [DcaDirection.Buy, DcaDirection.Sell];
const strategyButtonOptions = {
  in: [StrategyType.DCAIn, StrategyType.DCAPlusIn, StrategyType.WeightedScaleIn],
  out: [StrategyType.DCAOut, StrategyType.DCAPlusOut, StrategyType.WeightedScaleOut],
};

export function CategoryAndStrategyButtonSelectors() {
  const [strategyType, , helpers] = useField({ name: 'strategyType' });
  const [, , initialDenomHelpers] = useField({ name: 'initialDenom' });
  const [initialDeposit, , initialDepositHelpers] = useField({ name: 'initialDeposit' });
  const [, , resultingDenomHelpers] = useField({ name: 'resultingDenom' });

  const direction = strategyButtonOptions.in.includes(strategyType.value) ? DcaDirection.Buy : DcaDirection.Sell;

  const [selectedDirection, setSelectedDirection] = useState(direction);

  const updateStrategyType = (type: StrategyType) => {
    initialDenomHelpers.setValue('');
    initialDenomHelpers.setTouched(false);

    resultingDenomHelpers.setValue('');
    resultingDenomHelpers.setTouched(false);

    initialDepositHelpers.setValue(initialDeposit.value);
    initialDepositHelpers.setTouched(false);

    helpers.setValue(type);
  };

  const updateDcaDirection = (category: DcaDirection) => {
    updateStrategyType(category === DcaDirection.Buy ? StrategyType.DCAIn : StrategyType.DCAOut);
    setSelectedDirection(category);
  };

  const { getRootProps: getCategoryRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: selectedDirection,
    onChange: updateDcaDirection,
  });

  const { getRootProps: getStrategyRootProps, getRadioProps: getStrategyRadioProps } = useRadioGroup({
    name: 'strategy',
    defaultValue: strategyType.value,
    value: strategyType.value,
    onChange: updateStrategyType,
  });

  const strategyGroup = getStrategyRootProps();

  return (
    <VStack spacing={4} pb={6}>
      <HStack {...getCategoryRootProps()} spacing={{ base: 4, sm: 8 }}>
        {categoryButtonOptions.map((value) => (
          <CategoryRadioCard key={value} {...getRadioProps({ value })} buttonClicked={selectedDirection}>
            {value}
          </CategoryRadioCard>
        ))}
      </HStack>
      {selectedDirection === DcaDirection.Buy ? (
        <HStack {...strategyGroup} spacing={{ base: 1, sm: 2 }}>
          {strategyButtonOptions.in.map((value) => (
            <StrategyRadioCard
              key={value}
              {...getStrategyRadioProps({ value, isChecked: strategyType.value === value })}
            >
              {value}
            </StrategyRadioCard>
          ))}
        </HStack>
      ) : (
        <HStack {...strategyGroup} spacing={{ base: 1, sm: 2 }}>
          {strategyButtonOptions.out.map((value) => (
            <StrategyRadioCard
              key={value}
              {...getStrategyRadioProps({ value, isChecked: strategyType.value === value })}
            >
              {value}
            </StrategyRadioCard>
          ))}
        </HStack>
      )}
    </VStack>
  );
}
