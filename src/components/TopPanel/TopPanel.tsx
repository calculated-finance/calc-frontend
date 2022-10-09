import { Button, Heading, Text, Stack, Center, GridItem } from '@chakra-ui/react';
import ConnectWallet from '@components/ConnectWallet';
import Icon from '@components/Icon';
import { BarChartIcon } from '@fusion-icons/react/interface';
import { useWallet } from '@wizard-ui/react';

export default function TopPanel() {
  const { connected } = useWallet();
  return (
    <GridItem colSpan={{ base: 5 }}>
      <Center borderWidth={2} borderColor="brand.200" h="full" minHeight={294} layerStyle="panel" p={8}>
        {connected ? (
          <Stack spacing={6}>
            <Icon as={BarChartIcon} stroke="brand.200" strokeWidth={5} w={6} h={6} />
            <Stack spacing={2}>
              <Heading size="md">Ready to set up a CALC Strategy?</Heading>
              <Text fontSize="sm">
                CALC offers a range of mid-long term trading tools to help automate your investments, remove emotions
                and take back your time. In just 4 minutes, you can have CALC working for you with either take profit
                strategies or accumulation strategies.
              </Text>
            </Stack>
            <Button maxWidth={402} size="sm">
              Get Started
            </Button>
          </Stack>
        ) : (
          <ConnectWallet h={undefined} />
        )}
      </Center>
    </GridItem>
  );
}
