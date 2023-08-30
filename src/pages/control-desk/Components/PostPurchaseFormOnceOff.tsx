import { Box, Collapse, FormControl, FormHelperText, FormLabel, Stack, useRadioGroup } from '@chakra-ui/react';
import { Form, useField } from 'formik';
import Submit from '@components/Submit';
import RecipientAccount from '@components/RecipientAccount';
import DcaInSendToWallet from '@components/DcaInSendToWallet';
import { useChain } from '@hooks/useChain';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { useWallet } from '@hooks/useWallet';
import { DenomInfo } from '@utils/DenomInfo';
import YesNoValues from '@models/YesNoValues';
import Radio from '@components/Radio';
import RadioCard from '@components/RadioCard';
import { PostPurchaseOnceOffOptions } from '../create-strategy/PostPurchaseOnceOffOptions';

function PostPurchaseOptionRadio() {
  const [field, , helpers] = useField({ name: 'postPurchaseOption' });
  const { chain } = useChain();
  const { address } = useWallet();

  const sendToWalletData: { value: PostPurchaseOnceOffOptions; label: string; supported: boolean; enabled: boolean }[] = [
    {
      value: PostPurchaseOnceOffOptions.StreamPayment,
      label: 'Stream payment',
      supported: true,
      enabled: true,
    },
    {
      value: PostPurchaseOnceOffOptions.SinglePayment,
      label: 'Single payment',
      supported: true,
      enabled: true,
    },

  ].filter((option) => option.enabled);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <FormControl>
      <FormLabel>Stream payment or send once?</FormLabel>
      <FormHelperText>CALC can send after each swap, or once the target amount is reached.</FormHelperText>
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

export function PostPurchaseFormOnceOff({
  resultingDenom,
  submitButton,
}: {
  resultingDenom: DenomInfo;
  submitButton?: JSX.Element;
}) {

  const [{ value: sendToWalletValue }] = useField('sendToWallet');
  const [{ value: postPurchaseOption }] = useField('postPurchaseOption');

  return (
    <Form autoComplete="off">
      <Stack direction="column" spacing={6}>
        <PostPurchaseOptionRadio />
        <Box>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOnceOffOptions.SinglePayment}>
            <Stack>
              <DcaInSendToWallet resultingDenom={resultingDenom} />
              <CollapseWithRender in={sendToWalletValue === YesNoValues.No}>
                <RecipientAccount />
              </CollapseWithRender>
            </Stack>
          </CollapseWithRender>
          <CollapseWithRender in={postPurchaseOption === PostPurchaseOnceOffOptions.StreamPayment}>
            <Stack>
              <DcaInSendToWallet resultingDenom={resultingDenom} />
              <CollapseWithRender in={sendToWalletValue === YesNoValues.No}>
                <RecipientAccount />
              </CollapseWithRender>
            </Stack>
          </CollapseWithRender>

        </Box>
        {submitButton || <Submit>Next</Submit>}
      </Stack>
    </Form>
  );
}
