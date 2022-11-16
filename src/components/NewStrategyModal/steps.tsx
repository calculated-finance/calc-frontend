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
    footerText: 'What are advanced settings?',
    helpContent: (
      <Stack textStyle="body-xs">
        <Text>Advanced features offer you the following functionality:</Text>
        <OrderedList spacing={1} pb={2}>
          <ListItem>
            Start based on timeChoose a date and time in the future and when that time is hit, the strategy will begin
            to execute.
          </ListItem>

          <ListItem>
            Start based on price.Choose a price target and when the price is hit, the strategy will begin to execute
          </ListItem>
          <ListItem>
            Set buy price ceiling (for DCA In) or price floor (for DCA Out)Set buy price ceiling (for DCA In) or price
            floor (for DCA Out)
            <UnorderedList>
              <ListItem>
                CALC will not execute swaps if the price of the asset you are accumulating is higher (price ceiling on
                DCA in) than the price you set in this field or lower (price floors on DCA out).
              </ListItem>
              <ListItem>You can only set a price floor for DCA in and a price floor for DCA out.</ListItem>
              <ListItem>
                or example, If the price ceiling is set to $2.00 on a USK {'-->'} KUJI DCA out strategy and the KUJI
                price rises above $2.00 the swaps that are scheduled to happen will be skipped and your strategy will
                extend an interval. These skips will continue until the price drops below the price ceiling
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Set slippage tolerance
            <UnorderedList>
              <ListItem>
                If the slippage exceeds your tolerance, the swap will fail, be skipped for that increment and your
                strategy length will increase by 1 increment. This is automatically set to 2%, but you can change it to
                anything you like between 0% and 100%. You can see if a strategy failed because of slippage on the
                &ldquo;view performance&rdquo; page of each strategy.
              </ListItem>
            </UnorderedList>
          </ListItem>
        </OrderedList>
      </Stack>
    ),
  },
  {
    href: '/create-strategy/dca-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'How does auto staking work?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          CALC proudly removes the hassle of needing to manually stake your assets after every swap, otherwise we
          wouldn&apos;t truly be a complete set-and-forget solution. All you need to do is choose the validator of your
          choice and CALC will take care of the rest.
        </Text>

        <Text>
          CALC even uses the AuthZ module which means the assets are staked on YOUR behalf in YOUR wallet. You will see
          the balance staked to your wallet after every swap.
        </Text>

        <Text>
          Auto-compounding functionality will be added in Q1 2023 taking your returns to the next level by reinvesting
          the rewards every few hours. CALC will also add the ability to choose multiple validators in the near future.
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
