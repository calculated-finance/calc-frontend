export type StepConfig = {
  href: string;
  strategyType?: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
  successPage?: boolean;
  footerText?: string;
  helpContent?: JSX.Element;
};
