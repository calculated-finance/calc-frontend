import { Box, Collapse, FormControl, FormHelperText, FormLabel, Stack, useRadioGroup } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import Submit from '@components/Submit';
import getDenomInfo from '@utils/getDenomInfo';
import RecipientAccount from '@components/RecipientAccount';
import SendToWalletValues from '@models/SendToWalletValues';
import AutoStakeValidator, { DummyAutoStakeValidator } from '@components/AutoStakeValidator';
import DcaInSendToWallet from '@components/DcaInSendToWallet';
import { Denom } from '@models/Denom';
import { Chains, useChain } from '@hooks/useChain';
import { ChildrenProp } from '@helpers/ChildrenProp';
import RadioCard from './RadioCard';
import Radio from './Radio';
import { PostPurchaseOptions } from '../models/PostPurchaseOptions';
import GenerateYield from './GenerateYield';
import { Reinvest } from './Reinvest';

function PostPurchaseOptionRadio({ autoStakeSupported }: { autoStakeSupported: boolean }) {
  const [field, , helpers] = useField({ name: 'postPurchaseOption' });
  const { chain } = useChain();

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
      value: PostPurchaseOptions.Reinvest,
      label: 'Reinvest',
      supported: true,
      enabled: chain === Chains.Osmosis,
    },
    {
      value: PostPurchaseOptions.GenerateYield,
      label: 'Generate yield',
      supported: true,
      enabled: chain === Chains.Osmosis,
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

function CollapseWithRender({ in: inProp, children }: { in: boolean } & ChildrenProp) {
  return <Collapse in={inProp}>{inProp && <Box m="px">{children}</Box>}</Collapse>;
}

export function PostPurchaseForm({
  resultingDenom,
  submitButton,
}: {
  resultingDenom: Denom;
  submitButton?: JSX.Element;
}) {
  const stakeingPossible = getDenomInfo(resultingDenom).stakeable;

  const stakeingUnsupported = !getDenomInfo(resultingDenom).stakeableAndSupported;

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: postPurchaseOption }] = useField('postPurchaseOption');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <PostPurchaseOptionRadio autoStakeSupported={stakeingPossible} />
        <Box>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.SendToWallet}>
            <Stack>
              <DcaInSendToWallet resultingDenom={resultingDenom} />
              <CollapseWithRender in={sendToWalletValue === SendToWalletValues.No}>
                <RecipientAccount />
              </CollapseWithRender>
            </Stack>
          </CollapseWithRender>

          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.Stake && stakeingPossible}>
            {stakeingUnsupported ? <DummyAutoStakeValidator /> : <AutoStakeValidator />}
          </CollapseWithRender>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.Reinvest}>
            {postPurchaseOption === PostPurchaseOptions.Reinvest && <Reinvest resultingDenom={resultingDenom} />}
          </CollapseWithRender>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.GenerateYield}>
            {postPurchaseOption === PostPurchaseOptions.GenerateYield && (
              <GenerateYield resultingDenom={resultingDenom} />
            )}
          </CollapseWithRender>
        </Box>
        {submitButton || <Submit>Next</Submit>}
      </Stack>
    </Form>
  );
}
