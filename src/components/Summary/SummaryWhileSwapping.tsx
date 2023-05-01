import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { initialValues } from '@models/DcaInFormData';

export function SummaryWhileSwapping({
  initialDenom,
  resultingDenom,
  priceThresholdValue,
  slippageTolerance,
}: {
  initialDenom: string;
  resultingDenom: string;
  priceThresholdValue: number | null | undefined;
  slippageTolerance: number | null | undefined;
}) {
  // const { initialDenom, resultingDenom, priceThresholdValue, slippageTolerance } = state;

  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);

  const showSlippage =
    slippageTolerance !== undefined &&
    slippageTolerance !== null &&
    slippageTolerance !== initialValues.slippageTolerance;

  const showWhileSwapping = showSlippage || priceThresholdValue;
  return showWhileSwapping ? (
    <Box data-testid="summary-the-swap">
      <Text textStyle="body-xs">While swapping</Text>
      <Text lineHeight={8}>
        If the{' '}
        {Boolean(priceThresholdValue) && (
          <>
            <BadgeButton url="customise">
              <Text>{resultingDenomName}</Text>
              <DenomIcon denomName={resultingDenom} />
            </BadgeButton>{' '}
            price is higher than{' '}
            <BadgeButton url="customise">
              <Text>
                {priceThresholdValue} {initialDenomName}
              </Text>
              <DenomIcon denomName={initialDenom} />
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
