import { Box, Spinner, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import useValidator from '@hooks/useValidator';
import useStrategy from '@hooks/useStrategy';
import { getStrategyName } from '@helpers/strategy';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';

function ReinvestSummary({ reinvestStrategy }: { reinvestStrategy: string }) {
  const { data: strategy, isLoading } = useStrategy(reinvestStrategy);
  if (isLoading) {
    return <Spinner size="xs" />;
  }
  if (!strategy) {
    return null;
  }
  return (
    <>
      After each swap, CALC will automatically send the funds your tokens to your strategy{' '}
      <BadgeButton url="post-purchase">
        <Text>{getStrategyName(strategy.vault)}</Text>
      </BadgeButton>
    </>
  );
}

export function SummaryAfterEachSwap({ state }: { state: DcaFormState }) {
  const { resultingDenom, autoStakeValidator, recipientAccount, yieldOption, reinvestStrategy } = state;

  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  const { validator, isLoading } = useValidator(autoStakeValidator);

  return (
    <Box>
      <Text textStyle="body-xs">After each swap</Text>
      <Text lineHeight={8}>
        {!autoStakeValidator && !recipientAccount && !yieldOption && !reinvestStrategy && (
          <>
            After each swap, CALC will send{' '}
            <BadgeButton url="assets">
              <Text>{resultingDenomName}</Text>
              <DenomIcon denomName={resultingDenom} />
            </BadgeButton>{' '}
            to{' '}
            <BadgeButton url="post-purchase">
              <Text>your wallet</Text>
            </BadgeButton>
            .
          </>
        )}
        {autoStakeValidator && (
          <>
            After each swap, CALC will automatically stake your tokens with:{' '}
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              <BadgeButton url="post-purchase">
                <Text>{validator && validator.description?.moniker}</Text>
              </BadgeButton>
            )}
          </>
        )}
        {recipientAccount && (
          <>
            After each swap, CALC will send the funds to{' '}
            <BadgeButton url="post-purchase">
              <Text>{recipientAccount}</Text>
            </BadgeButton>
          </>
        )}
        {yieldOption === 'mars' && (
          <>
            After each swap, CALC will automatically loan your tokens to{' '}
            <BadgeButton url="post-purchase">
              <Text>Mars</Text>
            </BadgeButton>
          </>
        )}
        {reinvestStrategy && <ReinvestSummary reinvestStrategy={reinvestStrategy} />}
      </Text>
    </Box>
  );
}
