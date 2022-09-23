export type StepConfig = {
  href: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
};

const steps: StepConfig[] = [
  {
    href: '/create-strategy/dca-in',
    title: 'Choose Funding & Assets',
  },
  {
    href: '/create-strategy/dca-in/step2',
    title: 'Customise Strategy',
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
  },
];

export default steps;
