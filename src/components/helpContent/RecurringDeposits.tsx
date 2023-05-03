import { Stack, Text, Link } from '@chakra-ui/react';

export function RecurringDeposits() {
  return (
    <Stack textStyle="body">
      <Text>
        We don&apos;t support this yet but it is on the roadmap and will be CALC&apos;s next development focus to create
        a true, end-to-end DeFi experience.
      </Text>

      <Text>
        CALC is focused on ease of use and knows that recurring payments are part of a complete set-and-forget strategy.
        At the moment, we are waiting for the Axelar team to push the General Message Passing module to production and
        for Kado money to support recurring payments. Once that is ready, we will integrate with Kado Money and allow
        you to set up recurring payments directly from your bank account to CALC, automatically.
      </Text>

      <Text>
        This is estimated to be Q4 2023 but may happen sooner. Please follow{' '}
        <Link isExternal href="https://twitter.com/CALC_Finance">
          @CALC_finance
        </Link>{' '}
        on Twitter to stay up to date.
      </Text>
    </Stack>
  );
}
