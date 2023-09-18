import { Box, Text } from '@chakra-ui/react';
import DenomIcon from '@components/DenomIcon';
import getDenomInfo from '@utils/getDenomInfo';
import BadgeButton from '@components/BadgeButton';
import { CtrlFormDataAll } from '../ControlDeskForms';

export function SummaryAfterEachSwapControlDesk({ state }: { state: CtrlFormDataAll }) {
  const { resultingDenom, recipientArray } = state;

  const resultingDenomInfo = getDenomInfo(resultingDenom);

  return (
    <Box>
      <Text textStyle="body-xs">After each swap</Text>
      <Text lineHeight={8}>
        {!recipientArray && (
          <>
            After each swap, CALC will send{' '}
            <BadgeButton url="assets">
              <Text>{resultingDenomInfo.name}</Text>
              <DenomIcon denomInfo={resultingDenomInfo} />
            </BadgeButton>{' '}
            to{' '}
            <BadgeButton url="post-purchase">
              <Text>your wallet</Text>
            </BadgeButton>
          </>
        )}

        {recipientArray && (
          <>
            After each swap, CALC will send the funds to{' '}
            <BadgeButton url="post-purchase">
              {/* json.stringify to get a raw dump */}
              <Text>testwallet1234567890</Text>
            </BadgeButton>
          </>
        )}
      </Text>
    </Box>
  );
}
