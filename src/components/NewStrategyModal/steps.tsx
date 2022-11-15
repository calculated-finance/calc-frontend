import { Link, Stack, Text } from '@chakra-ui/react';

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
    href: '/create-strategy/dca-in/assets',
    title: 'Choose Funding & Assets',
    footerText: 'Can I set up recurring deposits?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          We don&apos;t support this yet but it is on the roadmap and will be CALC&apos;s next development focus to
          create a true, end-to-end DeFi experience.
        </Text>

        <Text>
          CALC is focused on ease of use and knows that recurring payments are part of a complete set-and-forget
          strategy. At the moment, we are waiting for the Axelar team to push the General Message Passing module to
          production and for Kado money to support recurring payments. Once that is ready, we will integrate with Kado
          Money and allow you to set up recurring payments directly from your bank account to CALC, automatically.
        </Text>

        <Text>
          This is estimated to be Q1 2023 but may happen sooner. Please follow{' '}
          <Link isExternal href="https://twitter.com/CALC_Finance">
            @CALC_finance
          </Link>{' '}
          on Twitter to stay up to date.
        </Text>
      </Stack>
    ),
  },
  {
    href: '/create-strategy/dca-in/customise',
    title: 'Customise Strategy',
    footerText: 'How do recurring investments work?',
    helpContent: (
      <Stack textStyle="body-xs">
        <Text>
          We don&apos;t support this yet but it is on the roadmap and will be CALC&apos;s next development focus to
          create a true, end-to-end DeFi experience.
        </Text>

        <Text>
          CALC is focused on ease of use and knows that recurring payments are part of a complete set-and-forget
          strategy. At the moment, we are waiting for the Axelar team to push the General Message Passing module to
          production and for Kado money to support recurring payments. Once that is ready, we will integrate with Kado
          Money and allow you to set up recurring payments directly from your bank account to CALC, automatically.
        </Text>

        <Text>
          This is estimated to be Q1 2023 but may happen sooner. Please follow{' '}
          <Link isExternal href="https://twitter.com/CALC_Finance">
            @CALC_finance
          </Link>{' '}
          on Twitter to stay up to date.
        </Text>
      </Stack>
    ),
  },
  {
    href: '/create-strategy/dca-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'What is auto staking and auto compounding?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          We don&apos;t support this yet but it is on the roadmap and will be CALC&apos;s next development focus to
          create a true, end-to-end DeFi experience.
        </Text>

        <Text>
          CALC is focused on ease of use and knows that recurring payments are part of a complete set-and-forget
          strategy. At the moment, we are waiting for the Axelar team to push the General Message Passing module to
          production and for Kado money to support recurring payments. Once that is ready, we will integrate with Kado
          Money and allow you to set up recurring payments directly from your bank account to CALC, automatically.
        </Text>

        <Text>
          This is estimated to be Q1 2023 but may happen sooner. Please follow{' '}
          <Link isExternal href="https://twitter.com/CALC_Finance">
            @CALC_finance
          </Link>{' '}
          on Twitter to stay up to date.
        </Text>
      </Stack>
    ),
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
