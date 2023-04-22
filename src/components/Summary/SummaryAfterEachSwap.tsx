import { Box, Spinner, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import useValidator from '@hooks/useValidator';

export function SummaryAfterEachSwap({ state }: any) {
  const { resultingDenom, autoStakeValidator, recipientAccount, yieldOption } = state;

  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  const { validator, isLoading } = useValidator(autoStakeValidator);

  return (
    <Box>
      <Text textStyle="body-xs">After each swap</Text>
      <Text lineHeight={8}>
        {!autoStakeValidator && !recipientAccount && !yieldOption && (
          <>
            After each swap, CALC will send{' '}
            <BadgeButton url="assets">
              <Text>{resultingDenomName}</Text>
              <DenomIcon denomName={resultingDenom} />
            </BadgeButton>{' '}
            to your wallet.
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
      </Text>
    </Box>
  );
}
