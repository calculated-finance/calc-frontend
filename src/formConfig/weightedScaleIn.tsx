import { Autostaking } from '@components/HelpContent/Autostaking';
import { contentData } from 'src/constants';
import { SwapMultiplierHelp } from '@components/HelpContent/SwapMultiplierHelp';
import { StepConfig } from './StepConfig';

export const weightedScaleInSteps: StepConfig[] = [
  {
    href: '/create-strategy/weighted-scale-in/assets',
    title: contentData.dcaIn.assets.title,
  },
  {
    href: '/create-strategy/weighted-scale-in/customise',
    title: contentData.dcaIn.customise.title,
    footerText: 'How does the swap multiplier work?',
    helpContent: <SwapMultiplierHelp />,
  },
  {
    href: '/create-strategy/weighted-scale-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'How does auto staking work?',
    helpContent: <Autostaking />,
  },
  {
    href: '/create-strategy/weighted-scale-in/confirm-purchase',
    title: 'Confirm & Sign',
  },
  {
    href: '/create-strategy/weighted-scale-in/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];
