import { Box, Spinner, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo, { getDenomName } from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import useValidator from '@hooks/useValidator';
import useStrategy from '@hooks/useStrategy';
import {
  getStrategyExecutionInterval,
  getStrategyName,
  getStrategyResultingDenom,
  getStrategyType,
} from '@helpers/strategy';
import { DcaFormState } from '@hooks/useCreateVault/DcaFormState';

function ReinvestSummary({ reinvestStrategy }: { reinvestStrategy: string }) {
  const { data, isLoading } = useStrategy(reinvestStrategy);
  if (isLoading) {
    return <Spinner size="xs" />;
  }
  if (!data) {
    return null;
  }

  const { vault: strategy } = data;
  return (
    <>
      After each swap, CALC will automatically reinvest those tokens into your{' '}
      <BadgeButton url="post-purchase">
        <Text>
          {getStrategyExecutionInterval(strategy)} {getDenomName(getStrategyResultingDenom(strategy))}{' '}
          {getStrategyType(strategy)} strategy
        </Text>
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
