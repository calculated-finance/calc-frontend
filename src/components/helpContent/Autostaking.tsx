import { Stack, Text } from '@chakra-ui/react';

export function Autostaking() {
  return (
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
        Auto-compounding functionality will be added in Q1 2023 taking your returns to the next level by reinvesting the
        rewards every few hours. CALC will also add the ability to choose multiple validators in the near future.
      </Text>
    </Stack>
  );
}
