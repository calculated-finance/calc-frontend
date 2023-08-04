import { Stack, Text } from '@chakra-ui/react';
import { SwapMultiplierHelp } from '@components/helpContent/SwapMultiplierHelp';
import { StrategyTypes } from '@models/StrategyTypes';
import { StepConfig } from 'src/formConfig/StepConfig';

const weightedScaleOutSteps: StepConfig[] = [
  {
    href: '/create-strategy/assets',
    strategyType: StrategyTypes.WeightedScaleOut,

    title: 'Choose Funding & Assets',
  },
  {
    href: '/create-strategy/weighted-scale-out/customise',
    title: 'Customise Strategy',
    footerText: 'How does the swap multiplier work?',
    helpContent: <SwapMultiplierHelp />,
  },
  {
    href: '/create-strategy/weighted-scale-out/post-purchase',
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
    href: '/create-strategy/weighted-scale-out/confirm-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/create-strategy/weighted-scale-out/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default weightedScaleOutSteps;
