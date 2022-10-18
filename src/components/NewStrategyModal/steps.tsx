export type StepConfig = {
  href: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
  successPage?: boolean;
  footerText?: string;
};

export function findStep(path: string, stepsConfig: StepConfig[]) {
  return stepsConfig.find((step) => step.href === path);
}

const steps: StepConfig[] = [
  {
    href: '/create-strategy/dca-in/assets',
    title: 'Choose Funding & Assets',
    footerText: 'Can I set up reoccuring deposits?',
  },
  {
    href: '/create-strategy/dca-in/customise',
    title: 'Customise Strategy',
    footerText: 'How do reoccuring investments work?',
  },
  {
    href: '/create-strategy/dca-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'What is auto staking and auto compounding?',
  },
  {
    href: '/create-strategy/dca-in/confirm-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/create-strategy/dca-in/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default steps;
