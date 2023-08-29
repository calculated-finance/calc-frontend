import { Stack, Text } from '@chakra-ui/react';
import { StepConfig } from 'src/formConfig/StepConfig';

const onceOffSteps: StepConfig[] = [
  {
    href: '/control-desk/create-strategy/once-off-payment/assets',
    title: 'Choose Funding & Assets',
    footerText: 'How does taking profit into fiat work?',
    helpContent: (
      <Stack textStyle="body">
        <Text>Once off payments.</Text>
      </Stack>
    ),
  },
  {
    href: '/control-desk/create-strategy/once-off-payment/customise',
    title: 'Customise Strategy',
    footerText: 'What are advanced settings?',
    helpContent: (
      <Stack textStyle="body" spacing={2}>
        <Text>Advanced features offer you the following functionality:</Text>
      </Stack>
    ),
  },
  {
    href: '/control-desk/create-strategy/once-off-payment/post-purchase',
    title: 'Post Purchase',
    footerText: 'What will I be able to do with my profits in the future?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          CALC is all about automation and we know that flexibility with your assets is key to an amazing product. A few
          things that you can expect to be added to this strategy set-up flow are reinvesting, moving to other yield
          generation strategies like providing liquidity and, even sending directly to your bank account when the KADO
          integration is completed.
        </Text>
      </Stack>
    ),
  },
  {
    href: '/control-desk/create-strategy/once-off-payment/conform-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/control-desk/create-strategy/once-off-payment/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default onceOffSteps;
