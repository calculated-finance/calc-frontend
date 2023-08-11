import { Link, ListItem, OrderedList, Stack, Text, UnorderedList } from '@chakra-ui/react';
import { StrategyTypes } from '@models/StrategyTypes';
import { StepConfig } from 'src/formConfig/StepConfig';

const dcaOutSteps: StepConfig[] = [
  {
    href: '/create-strategy/dca-out/assets',
    strategyType: StrategyTypes.DCAOut,
    title: 'Choose Funding & Assets',
    footerText: 'How does taking profit into fiat work?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          We don&apos;t support this yet but it is on the roadmap and will be CALC&apos;s next development focus to
          create a true, end-to-end DeFi experience. After the Kado Money integration, you&apos;ll be able to create a
          Kado Money account within CALC, link your bank account and have profits sent directly to your account.
        </Text>

        <Text>
          This is estimated to be Q4 2023 but may happen sooner. Please follow{' '}
          <Link isExternal href="https://twitter.com/CALC_Finance">
            @CALC_finance
          </Link>{' '}
          on Twitter to stay up to date.
        </Text>
      </Stack>
    ),
  },
  {
    href: '/create-strategy/dca-out/customise',
    title: 'Customise Strategy',
    footerText: 'What are advanced settings?',
    helpContent: (
      <Stack textStyle="body" spacing={2}>
        <Text>Advanced features offer you the following functionality:</Text>
        <OrderedList spacing={1} pb={2} pl={4}>
          <ListItem>
            Start based on time.
            <UnorderedList>
              <ListItem>
                Choose a date and time in the future and when that time is hit, the strategy will begin to execute.
              </ListItem>
            </UnorderedList>
          </ListItem>

          <ListItem>
            Start based on price.
            <UnorderedList>
              <ListItem>Choose a price target and when the price is hit, the strategy will begin to execute</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Set buy price ceiling (for DCA In) or price floor (for DCA Out)
            <UnorderedList>
              <ListItem>
                CALC will not execute swaps if the price of the asset you are accumulating is higher (price ceiling on
                DCA in) than the price you set in this field or lower (price floors on DCA out).
              </ListItem>
              <ListItem>You can only set a price floor for DCA in and a price floor for DCA out.</ListItem>
              <ListItem>
                For example, If the price ceiling is set to $2.00 on a USK {'-->'} KUJI DCA out strategy and the KUJI
                price rises above $2.00 the swaps that are scheduled to happen will be skipped and your strategy will
                extend an interval. These skips will continue until the price drops below the price ceiling.
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
    href: '/create-strategy/dca-out/post-purchase',
    title: 'Post Purchase',
    footerText: 'What will I be able to do with my profits in the future?',
    helpContent: (
      <Stack textStyle="body">
        <Text>
          CALC is all about automation and we know that flexibility with your assets is key to an amazing product. A few
          things that you can expect to be added to this strategy set-up flow are reinvesting, moving to other yield
          generation strategies like providing liquidity and, even sending directly to your bank account when the KADO
          integration is completed.
        </Text>
      </Stack>
    ),
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
