import { Box, Collapse, Stack } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import Submit from '@components/Submit';
import { useState } from 'react';
import getDenomInfo from '@utils/getDenomInfo';
import RecipientAccount from '@components/RecipientAccount';
import SendToWalletValues from '@models/SendToWalletValues';
import AutoStakeValues from '@models/AutoStakeValues';
import AutoStakeValidator, { DummyAutoStakeValidator } from '@components/AutoStakeValidator';
import { AutoStake, DummyAutoStake } from '@components/AutoStake';
import DcaInSendToWallet from '@components/DcaInSendToWallet';
import { Denom } from '@models/Denom';
import { FormNames } from '@hooks/useDcaInForm';

export function PostPurchaseForm({ resultingDenom, formName }: { resultingDenom: Denom; formName: FormNames }) {
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);

  const stakeingPossible = getDenomInfo(resultingDenom).stakeable;

  const stakeingUnsupported = !getDenomInfo(resultingDenom).stakeableAndSupported;

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: autoStakeValue }] = useField('autoStake');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <DcaInSendToWallet formName={formName} />
        <Collapse in={sendToWalletValue === SendToWalletValues.No}>
          <Box m="px">
            <RecipientAccount />
          </Box>
        </Collapse>
        {stakeingPossible && (
          <Collapse in={sendToWalletValue === SendToWalletValues.Yes}>
            {stakeingUnsupported ? (
              <>
                <DummyAutoStake value={dummyAutoStake} onChange={setDummyAutoStake} formName={formName} />
                <Collapse in={dummyAutoStake === AutoStakeValues.Yes}>
                  <Box m="px">
                    <DummyAutoStakeValidator />
                  </Box>
                </Collapse>
              </>
            ) : (
              <>
                <AutoStake formName={formName} />
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
