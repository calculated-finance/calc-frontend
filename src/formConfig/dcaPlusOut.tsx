import { Stack, Text } from '@chakra-ui/react';
import { OutperformProbability } from '@components/HelpContent/OutperformProbability';
import { StepConfig } from 'src/formConfig/StepConfig';

const dcaPlusOutSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-plus-out/assets',
    title: 'Choose Funding & Assets',
  },
  {
    href: '/create-strategy/dca-plus-out/customise',
    title: 'Customise Strategy',
    footerText: 'What does outperform probability mean?',
    helpContent: <OutperformProbability />,
  },
  {
    href: '/create-strategy/dca-plus-out/post-purchase',
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
    href: '/create-strategy/dca-plus-out/confirm-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/create-strategy/dca-plus-out/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default dcaPlusOutSteps;
