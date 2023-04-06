export type StepConfig = {
  href: string;
  title: string;
  noBackButton?: boolean;
  noJump?: boolean;
  successPage?: boolean;
  footerText?: string;
  helpContent?: JSX.Element;
};
