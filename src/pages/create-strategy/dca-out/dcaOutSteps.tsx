import { StepConfig } from '@components/NewStrategyModal/steps';

const dcaOutSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-out',
    title: 'Choose Funding & Assets',
    footerText: 'How does taking profit work?',
  },
  {
    href: '/create-strategy/dca-out/step2',
    title: 'Customise Strategy',
  },
  {
    href: '/create-strategy/dca-out/post-purchase',
    title: 'Post Purchase',
    footerText: 'How to use CALC’s DCA out strategy to mange cashflow',
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
