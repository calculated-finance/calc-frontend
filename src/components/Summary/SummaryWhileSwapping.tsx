import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import BadgeButton from '@components/BadgeButton';
import { initialValues } from '@models/DcaInFormData';
import { DenomInfo } from '@utils/DenomInfo';

export function SummaryWhileSwapping({
  initialDenom,
  resultingDenom,
  priceThresholdValue,
  slippageTolerance,
  transactionType,
}: {
  initialDenom: DenomInfo;
  resultingDenom: DenomInfo;
  priceThresholdValue: number | null | undefined;
  slippageTolerance: number | null | undefined;
  transactionType: string;
}) {
  const { name: initialDenomName } = initialDenom;
  const { name: resultingDenomName } = resultingDenom;

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
