import { RecurringDeposits } from '@components/helpContent/RecurringDeposits';
import { StepConfig } from '@formConfig/StepConfig';
import { contentData } from 'src/constants';

const simpleDcaInSteps: StepConfig[] = [
  {
    href: '/',
    title: contentData.dcaIn.assets.title,
    footerText: contentData.dcaIn.assets.footerText,
    helpContent: <RecurringDeposits />,
  },
];

export default simpleDcaInSteps;
