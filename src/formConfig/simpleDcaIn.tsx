import { StepConfig } from '@formConfig/StepConfig';
import { contentData } from 'src/constants';

const simpleDcaInSteps: StepConfig[] = [
  {
    href: '/',
    title: contentData.dcaIn.assets.title,
  },
  {
    href: '/',
    title: 'Strategy Created!',
    noJump: true,
    successPage: true,
  },
];

export default simpleDcaInSteps;
