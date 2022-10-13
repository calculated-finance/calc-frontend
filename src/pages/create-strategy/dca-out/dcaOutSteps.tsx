export type StepConfig = {
  href: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
  successPage?: boolean;
};

const dcaOutSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-out',
    title: 'Choose Funding & Assets',
  },
  {
    href: '/create-strategy/dca-out/step2',
    title: 'Customise Strategy',
  },
  {
    href: '/create-strategy/dca-out/post-purchase',
    title: 'Post Purchase',
  },
  {
    href: '/create-strategy/dca-out/confirm-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/create-strategy/dca-out/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default dcaOutSteps;
