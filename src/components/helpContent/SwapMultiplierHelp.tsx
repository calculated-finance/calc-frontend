import { Stack, Text, Image, Center, Link, Tooltip, VStack, Spacer } from '@chakra-ui/react';

export function SwapMultiplierHelp() {
  return (
    <Stack spacing={8} textAlign="justify">
      <Stack textStyle="body">
        <Text>
          The purpose of this multiplier is to give more{' '}
          <Tooltip
            label='
          "Weight" refers to the importance or significance given to different factors or components. Swaps with higher weights will
          have a greater impact on the final outcome, while swaps with lower weights will have less influence.'
          >
            <Text color="grey.200" as={Link}>
              weight{' '}
            </Text>
          </Tooltip>
          to swaps that are deemed more favorable and less weight to swaps that are considered less favorable.
        </Text>

        <Spacer />

        <Center p={2}>
          <VStack>
            <Image h={267} src="/images/swap-multiplier-help.jpg" alt="swap multiplier" boxSize="auto" w="80%" />
            <Text fontSize="xs" textAlign="center">
              A degen once said, &quot;price good: ape more, price bad: ape less&quot;.
            </Text>
          </VStack>
        </Center>
        <Spacer />

        <Text>
          The swap amount is determined through a linear transformation process. It involves assigning a numerical value
          or score to each swap based on the asset price at the time of the swap.
        </Text>

        <Text fontStyle="italic">
          The more aggressive the swap multiplier, the more weight price changes will have on the swap.
        </Text>

        <Text>
          By using the swap multiplier in this way, we aim to help users make swaps (buys or sells) at a more favorable
          price.
        </Text>
      </Stack>
    </Stack>
  );
}
