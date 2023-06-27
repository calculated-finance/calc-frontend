import { Box, Collapse, FormControl, FormHelperText, FormLabel, Stack, useRadioGroup } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import Submit from '@components/Submit';
import RecipientAccount from '@components/RecipientAccount';
import AutoStakeValidator, { DummyAutoStakeValidator } from '@components/AutoStakeValidator';
import DcaInSendToWallet from '@components/DcaInSendToWallet';
import { useChain } from '@hooks/useChain';
import { Chains } from '@hooks/useChain/Chains';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { isV2Enabled } from '@helpers/version/isV2Enabled';
import { useWallet } from '@hooks/useWallet';
import { DenomInfo } from '@utils/DenomInfo';
import YesNoValues from '@models/YesNoValues';
import GenerateYield from '@components/GenerateYield';
import AutoCompoundStakingRewards from '@components/AutocompoundStakingRewards';
import RadioCard from '../../RadioCard';
import Radio from '../../Radio';
import { PostPurchaseOptions } from '../../../models/PostPurchaseOptions';
import { Reinvest } from '../../Reinvest';

function PostPurchaseOptionRadio({ autoStakeSupported }: { autoStakeSupported: boolean }) {
  const [field, , helpers] = useField({ name: 'postPurchaseOption' });
  const { chain } = useChain();
  const { address } = useWallet();

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
      enabled: isV2Enabled(chain, address),
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
              disabledMessage="Not supported for this strategy"
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
  autoCompoundStakingRewardsEnabled,
  submitButton,
}: {
  resultingDenom: DenomInfo;
  autoCompoundStakingRewardsEnabled?: boolean;
  submitButton?: JSX.Element;
}) {
  const stakingPossible = resultingDenom.stakeable;
  const stakingUnsupported = !resultingDenom.stakeableAndSupported;

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: postPurchaseOption }] = useField('postPurchaseOption');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <PostPurchaseOptionRadio autoStakeSupported={stakingPossible} />
        <Box>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.SendToWallet}>
            <Stack>
              <DcaInSendToWallet resultingDenom={resultingDenom} />
              <CollapseWithRender in={sendToWalletValue === YesNoValues.No}>
                <RecipientAccount />
              </CollapseWithRender>
            </Stack>
          </CollapseWithRender>

          <CollapseWithRender in={postPurchaseOption === PostPurchaseOptions.Stake && stakingPossible}>
            {stakingUnsupported ? (
              <DummyAutoStakeValidator />
            ) : (
              <Stack>
                <AutoStakeValidator />
                <AutoCompoundStakingRewards enabled={autoCompoundStakingRewardsEnabled ?? true} />
              </Stack>
            )}
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
