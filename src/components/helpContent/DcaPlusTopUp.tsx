import { Stack, Text } from '@chakra-ui/react';

export function DcaPlusTopUp() {
  return (
    <Stack textStyle="body">
      <Text>
        It responds by altering the timeframe over which it assesses risk to accommodate for the new duration that
        capital deployment will take after the top up.
      </Text>

      <Text>
        The base buy-amount will not change, but with the new risk assessment, the coefficient used to modify it will.
      </Text>

      <Text>
        It&apos;s important to note that two back-to-back 45-day strategies (using a top up) won&apos;t perform the same
        as a single 90-day strategy, because different risk-assessments are applied to each.
      </Text>
    </Stack>
  );
}
