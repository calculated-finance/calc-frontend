import {
  Heading,
  Stack,
  Text,
  Image,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
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
      <Accordion allowMultiple>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading fontSize="xl">How CALC Works</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text textStyle="body">
              CALC is a powerful decentralized suite of financial tools that give you access to set-and-forget
              investment strategies so you can spend more time on the things you love.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} />
        </AccordionItem>
      </Accordion>

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
      <Stack>
        <Heading fontSize="xl">CALC&apos;s mission</Heading>

        <Text textStyle="body">CALC is a tool build for DeFi users, by DeFi users.</Text>
      </Stack>
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
