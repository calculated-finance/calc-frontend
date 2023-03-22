import { Stack, Text, Divider, Image, Center, Link } from '@chakra-ui/react';

export function OutperformProbability() {
  return (
    <Stack spacing={8}>
      <Stack textStyle="body">
        <Text>
          Outperform probability refers to the likelihood of DCA+ delivering better returns than traditional DCA over a
          given period of time.
        </Text>

        <Text>
          Given the strategy and the volatility of the cryptocurrency market, longer timeframes produce a higher
          likelihood of a better performance.
        </Text>

        <Text>We recommend at least 90 days to get the most out of DCA+.</Text>

        <Text>
          Want to get technical? You can read the whitepaper here:{' '}
          <Link href="https://calculated.fi/dca-plus-wp" isExternal>
            https://calculated.fi/dca-plus-wp
          </Link>
        </Text>
      </Stack>
      <Divider />
      <Center>
        <Image h={267} src="/images/outperformProbability.svg" alt="outperform probabliity" />
      </Center>
    </Stack>
  );
}
