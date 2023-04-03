import { Box, Collapse, Stack } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import Submit from '@components/Submit';
import { useState } from 'react';
import getDenomInfo from '@utils/getDenomInfo';
import RecipientAccount from '@components/RecipientAccount';
import SendToWalletValues from '@models/SendToWalletValues';
import AutoStakeValues from '@models/AutoStakeValues';
import AutoStakeValidator, { DummyAutoStakeValidator } from '@components/AutoStakeValidator';
import { AutoStakeOut, DummyAutoStakeOut } from '@components/AutoStakeOut';
import { Denom } from '@models/Denom';
import DcaOutSendToWallet from './DcaOutSendToWallet';

export function PostPurchaseFormDcaOut({ resultingDenom }: { resultingDenom: Denom }) {
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);

  // const stakeingPossible = true;
  // const stakeingUnsupported = false;
  const stakeingPossible = getDenomInfo(resultingDenom).stakeable;

  const stakeingUnsupported = !getDenomInfo(resultingDenom).stakeableAndSupported;

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: autoStakeValue }] = useField('autoStake');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <DcaOutSendToWallet />
        <Collapse in={sendToWalletValue === SendToWalletValues.No}>
          <Box m="px">
            <RecipientAccount />
          </Box>
        </Collapse>
        {stakeingPossible && (
          <Collapse in={sendToWalletValue === SendToWalletValues.Yes}>
            {stakeingUnsupported ? (
              <>
                <DummyAutoStakeOut value={dummyAutoStake} onChange={setDummyAutoStake} />
                <Collapse in={dummyAutoStake === AutoStakeValues.Yes}>
                  <Box m="px">
                    <DummyAutoStakeValidator />
                  </Box>
                </Collapse>
              </>
            ) : (
              <>
                <AutoStakeOut />
                <Collapse in={autoStakeValue === AutoStakeValues.Yes}>
                  <Box m="px">
                    <AutoStakeValidator />
                  </Box>
                </Collapse>
              </>
            )}
          </Collapse>
        )}
        <Submit>Next</Submit>
      </Stack>
    </Form>
  );
}
