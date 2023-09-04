import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { DenomInfo } from '@utils/DenomInfo';
import { useControlDeskStrategyInfo } from '../../useControlDeskStrategyInfo';
import { initialCtrlValues } from '../ControlDeskForms';

export function SummaryWhileSwappingControlDesk({
  initialDenom,
  resultingDenom,
  priceThresholdValue,
  slippageTolerance,
}: {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  priceThresholdValue: number | null | undefined;
  slippageTolerance: number | null | undefined;
}) {
  const { name: initialDenomName } = initialDenom;
  const { name: resultingDenomName } = resultingDenom;

  const { transactionType } = useControlDeskStrategyInfo();

  const showSlippage =
    slippageTolerance !== undefined &&
    slippageTolerance !== null &&
    slippageTolerance !== initialCtrlValues.slippageTolerance;

  const showWhileSwapping = showSlippage || priceThresholdValue;

  return showWhileSwapping ? (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">While swapping</Text>
      <Text lineHeight={8}>
        If the{' '}
        {Boolean(priceThresholdValue) && transactionType === 'buy' ? (
          <>
            <BadgeButton url="customise">
              <Text>{resultingDenomName}</Text>
              <DenomIcon denomInfo={initialDenom} />
            </BadgeButton>{' '}
            price is higher than{' '}
            <BadgeButton url="customise">
              <Text>
                {priceThresholdValue} {initialDenomName}
              </Text>
              <DenomIcon denomInfo={initialDenom} />
            </BadgeButton>{' '}
          </>
        ) : (
          <>
            <BadgeButton url="customise">
              <Text>{initialDenomName}</Text>
              <DenomIcon denomInfo={initialDenom} />
            </BadgeButton>{' '}
            price is lower than{' '}
            <BadgeButton url="customise">
              <Text>
                {priceThresholdValue} {resultingDenomName}
              </Text>
              <DenomIcon denomInfo={resultingDenom} />
            </BadgeButton>{' '}
          </>
        )}
        {showSlippage && (
          <>
            {Boolean(priceThresholdValue) && 'or '}
            slippage exceeds{' '}
            <BadgeButton url="customise">
              <Text>{slippageTolerance}%</Text>
            </BadgeButton>
            {', '}
          </>
        )}
        CALC will not swap.
      </Text>
    </Box>
  ) : null;
}
