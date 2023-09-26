import { RecurringDeposits } from '@components/helpContent/RecurringDeposits';
import { contentData } from 'src/constants';
import { StepConfig } from './StepConfig';

const simpleDcaInSteps: StepConfig[] = [
  {
    href: '/',
    title: contentData.dcaIn.assets.title,
    footerText: contentData.dcaIn.assets.footerText,
    helpContent: <RecurringDeposits />,
  },
];

export default simpleDcaInSteps;
