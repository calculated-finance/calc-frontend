import { Button, Flex, Grid, GridItem, Heading, Icon, Link, Spacer, Stack, Text, VStack } from "@chakra-ui/react";
import { getSidebarLayout } from "@components/Layout";
import { Code3Icon } from '@fusion-icons/react/interface';




export function OnceOffPayment() {
  return (
    <Flex layerStyle="panel" px={8} py={4} alignItems="center">
      <VStack spacing={4}>
        <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />

        <Heading size="md">Once off payment</Heading>
        <Text textStyle="body" textAlign='center'>
          Deposit an asset, use it to DCA into the asset you want to make the payment in and once the grant target amount is reached, get the remaining assets returned back to your treasury.</Text>
        <Link href='https://www.youtube.com/' isExternal>
          <Button w={44} color="brand.200" textColor='abyss.200'>
            Get started
          </Button>
        </Link>
        <Link href='https://www.youtube.com/' isExternal textColor='whiteAlpha.800' _hover={{ textColor: 'blue.200' }}>
          Learn more
        </Link>
      </VStack>
    </Flex>
  );
}
export function PayrollAutomation() {
  return (
    <Flex layerStyle="panel" px={8} py={4} alignItems="center">
      <VStack spacing={4}>
        <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />

        <Heading size="md">Payroll Automation</Heading>
        <Text textStyle="body" textAlign='center'>
          Consistently DCA out of treasury assets to prevent price impact and make regular payments in stables to one or more parties on a regular basis.</Text>
        <Link href='https://www.youtube.com/' isExternal>
          <Button w={44} color="brand.200" textColor='abyss.200'>
            Get started
          </Button>
        </Link>
        <Link href='https://www.youtube.com/' isExternal textColor='whiteAlpha.800' _hover={{ textColor: 'blue.200' }}>
          Learn more
        </Link>
      </VStack>
    </Flex>
  );
}
export function TreasuryExchange() {
  return (
    <Flex layerStyle="panel" px={8} py={4} alignItems="center">
      <VStack spacing={4}>
        <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />

        <Heading size="md">Treasury exchange</Heading>
        <Text textStyle="body" textAlign='center'>
          Can’t agree on a fair OTC price? Swap tokens over time with another treasury and turn a single transactional event into a long lasting relationship.</Text>
        <Link href='https://www.youtube.com/' isExternal>
          <Button w={44} color="brand.200" textColor='abyss.200'>
            Get started
          </Button>
        </Link>
        <Link href='https://www.youtube.com/' isExternal textColor='whiteAlpha.800' _hover={{ textColor: 'blue.200' }}>
          Learn more
        </Link>
      </VStack>
    </Flex>
  );
}



export function ControlDesk() {

  return (
    <Stack>
      <Stack pb={6}>
        <Heading size="lg">Welcome to the CONTROL DESK</Heading>
        <Spacer />
        <Text textStyle="md">
          Built for treasuries to pay salaries, grants, and swap tokens the calculated way.
        </Text>
        <Text textStyle="body">
          Choose an option that suits you and your treasury.        </Text>
      </Stack>
      {/* <Heading size="md">Tools</Heading> */}
      <Grid gap={8} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch" pb={6}>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
          <OnceOffPayment />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
          <PayrollAutomation />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 3 }}>
          <TreasuryExchange />
        </GridItem>
      </Grid>
    </Stack>
  )
}


ControlDesk.getLayout = getSidebarLayout;

export default ControlDesk;