import { Box, Collapse, FormControl, FormHelperText, FormLabel, Stack, useRadioGroup } from '@chakra-ui/react';
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
import { FormNames } from '@hooks/useFormStore';
import { Chains, useChain } from '@hooks/useChain';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { PostPurchaseOptions } from '../models/PostPurchaseOptions';
import GenerateYield from './GenerateYield';

function PostPurchaseOptionRadio({ autoStakeSupported }: { autoStakeSupported: boolean }) {
  const [field, , helpers] = useField({ name: 'postPurchaseOption' });

  const sendToWalletData: { value: PostPurchaseOptions; label: string; supported: boolean; enabled: boolean }[] = [
    {
      value: PostPurchaseOptions.SendToWallet,
      label: 'Send',
      supported: true,
      enabled: true,
    },
    {
      value: PostPurchaseOptions.Stake,
      label: 'Stake',
      supported: autoStakeSupported,
      enabled: true,
    },
    {
      value: PostPurchaseOptions.GenerateYield,
      label: 'Generate yield',
      supported: true,
      enabled: false,
    },
  ].filter((option) => option.enabled);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>What do you want to do with the funds after each swap?</FormLabel>
      <FormHelperText>Choose one automation to save time through on-chain composability.</FormHelperText>
      <Radio {...getRootProps} w="full" borderRadius="md">
        {sendToWalletData.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard
              key={option.label}
              {...radio}
              flexGrow={radio.isChecked ? 1 : 0}
              align="center"
              borderRadius="md"
              isDisabled={!option.supported}
            >
              {option.label}
            </RadioCard>
          );
        })}
      </Radio>
    </FormControl>
  );
}

export function PostPurchaseForm({ resultingDenom, formName }: { resultingDenom: Denom; formName: FormNames }) {
  const [dummyAutoStake, setDummyAutoStake] = useState(AutoStakeValues.No);

  const stakeingPossible = getDenomInfo(resultingDenom).stakeable;

  const stakeingUnsupported = !getDenomInfo(resultingDenom).stakeableAndSupported;

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: autoStakeValue }] = useField('autoStake');
  const [{ value: postPurchaseOption }] = useField('postPurchaseOption');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <PostPurchaseOptionRadio autoStakeSupported={stakeingPossible} />
        <Box>
          <Collapse in={postPurchaseOption === PostPurchaseOptions.SendToWallet}>
            <Box m="px">
              <Stack>
                <DcaInSendToWallet formName={formName} />
                <Collapse in={sendToWalletValue === SendToWalletValues.No}>
                  <Box m="px">
                    <RecipientAccount />
                  </Box>
                </Collapse>
              </Stack>
            </Box>
          </Collapse>

          <Collapse in={postPurchaseOption === PostPurchaseOptions.Stake && stakeingPossible}>
            <Box m="px">
              <Stack>
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
              </Stack>
            </Box>
          </Collapse>
          <Collapse in={postPurchaseOption === PostPurchaseOptions.GenerateYield}>
            <Box m="px" minH={250}>
              {postPurchaseOption === PostPurchaseOptions.GenerateYield && <GenerateYield formName={formName} />}
            </Box>
          </Collapse>
        </Box>

        <Submit>Next</Submit>
      </Stack>
    </Form>
  );
}
