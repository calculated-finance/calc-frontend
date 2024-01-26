import { Autostaking } from '@components/HelpContent/Autostaking';
import { OutperformProbability } from '@components/HelpContent/OutperformProbability';
import { contentData } from 'src/constants';
import { StepConfig } from './StepConfig';

export const dcaPlusInSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-plus-in/assets',
    title: contentData.dcaIn.assets.title,
  },
  {
    href: '/create-strategy/dca-plus-in/customise',
    title: contentData.dcaIn.customise.title,
    footerText: 'What does outperform probability mean?',
    helpContent: <OutperformProbability />,
  },
  {
    href: '/create-strategy/dca-plus-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'How does auto staking work?',
    helpContent: <Autostaking />,
  },
  {
    href: '/create-strategy/dca-plus-in/confirm-purchase',
    title: 'Confirm & Sign',
  },
  {
    href: '/create-strategy/dca-plus-in/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];
