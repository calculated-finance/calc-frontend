import { StepConfig } from 'src/formConfig/StepConfig';

export const customiseSteps: StepConfig[] = [
  {
    href: '/strategies/customise',
    title: 'Customise Strategy',
  },
  {
    href: '/strategies/customise/success',
    title: 'Customise Successful',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];
