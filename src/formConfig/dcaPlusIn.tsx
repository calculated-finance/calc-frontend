import { Autostaking } from '@components/helpContent/Autostaking';
import { OutperformProbability } from '@components/helpContent/OutperformProbability';
import { contentData } from 'src/constants';
import { StepConfig } from './StepConfig';

export const dcaPlusInSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-plus-in-puff-puff/assets',
    title: contentData.dcaIn.assets.title,
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/customise',
    title: contentData.dcaIn.customise.title,
    footerText: 'What does outperform probability mean?',
    helpContent: <OutperformProbability />,
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/post-purchase',
    title: 'Post Purchase',
    footerText: 'How does auto staking work?',
    helpContent: <Autostaking />,
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/confirm-purchase',
    title: 'Confirm & Sign',
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];
