import { Link, ListItem, OrderedList, Stack, Text, UnorderedList } from '@chakra-ui/react';

export type StepConfig = {
  href: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
  successPage?: boolean;
  footerText?: string;
  helpContent?: JSX.Element;
};

export function findStep(path: string, stepsConfig: StepConfig[]) {
  return stepsConfig.find((step) => step.href === path);
}

const steps: StepConfig[] = [
  {
    href: '/create-portfolio/basket-of-assets/assets',
    title: 'Choose your assets',
  },
  {
    href: '/create-portfolio/basket-of-assets/customise',
    title: 'Customise basket',
  },
  {
    href: '/create-portfolio/basket-of-assets/rebalance',
    title: 'Rebalancing',
  },
  {
    href: '/create-portfolio/basket-of-assets/permissions',
    title: 'Set permissions',
  },
  {
    href: '/create-portfolio/basket-of-assets/confirm-purchase',
    title: 'Confirm & Sign',
  },

  {
    href: '/create-portfolio/basket-of-assets/success',
    title: 'Strategy Set Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default steps;
