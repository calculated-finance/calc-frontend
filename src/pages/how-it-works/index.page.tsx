import { Heading, Stack, Text, Image } from '@chakra-ui/react';
import { getSidebarLayout } from '../../components/Layout';

function HowItWorks() {
  return (
    <Stack spacing={6}>
      <Stack>
        <Heading fontSize="4xl">CALC Finance</Heading>
        <Text textStyle="body">
          CALC is a powerful decentralized suite of financial tools that give you access to set-and-forget investment
          strategies so you can spend more time on the things you love.
        </Text>
      </Stack>
      <Stack>
        <Heading fontSize="xl">How CALC works</Heading>
        <Text textStyle="body">CALC is a tool build for DeFi users, by DeFi users.</Text>
      </Stack>
      <Stack>
        <Heading fontSize="xl">Why CALC was built</Heading>
        <Text textStyle="body">CALC is a tool build for DeFi users, by DeFi users.</Text>
      </Stack>
      <Stack>
        <Heading fontSize="xl">Dollar Cost averaging from your bank account with CALC</Heading>
      </Stack>
      <Image src="/images/dca.svg" alt="Dollar Cost Averaging" />

      <Heading fontSize="xl">CALC&apos;s mission</Heading>

      <Text textStyle="body">CALC is a tool build for DeFi users, by DeFi users.</Text>
      <Stack>
        <Heading as="i" fontSize="xl">
          CALC is all about saving you time and removing the emotion from the hardest part of Crypto, trading.
        </Heading>
      </Stack>
    </Stack>
  );
}

HowItWorks.getLayout = getSidebarLayout;

export default HowItWorks;
