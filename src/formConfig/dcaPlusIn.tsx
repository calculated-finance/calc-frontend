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
];
