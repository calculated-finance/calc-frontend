import { ListItem, OrderedList, Stack, Text, UnorderedList } from '@chakra-ui/react';
import { RecurringDeposits } from '@components/helpContent/RecurringDeposits';
import { contentData } from 'src/constants';
import { Autostaking } from '../components/helpContent/Autostaking';
import { StepConfig } from './StepConfig';
import { StrategyTypes } from '@models/StrategyTypes';

const steps: StepConfig[] = [
  {
    href: '/create-strategy/assets',
    strategyType: StrategyTypes.DCAIn ,
    title: contentData.dcaIn.assets.title,
    footerText: contentData.dcaIn.assets.footerText,
    helpContent: <RecurringDeposits />,
  },
  {
    href: '/create-strategy/dca-in/customise',
    title: contentData.dcaIn.customise.title,
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
    href: '/create-strategy/dca-in/post-purchase',
    title: 'Post Purchase',
    footerText: 'How does auto staking work?',
    helpContent: <Autostaking />,
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
