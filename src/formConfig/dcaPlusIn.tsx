import { RecurringDeposits } from '@components/helpContent/RecurringDeposits';
import { contentData } from 'src/constants';
import { StepConfig } from './StepConfig';

export const dcaPlusInSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-plus-in-puff-puff/assets',
    title: contentData.dcaIn.assets.title,
    footerText: contentData.dcaIn.assets.footerText,
    helpContent: <RecurringDeposits />,
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/customise',
    title: contentData.dcaIn.customise.title,
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/post-purchase',
    title: 'Post Purchase',
  },
  {
    href: '/create-strategy/dca-plus-in-puff-puff/confirm-purchase',
    title: 'Confirm & Sign',
  },
];
