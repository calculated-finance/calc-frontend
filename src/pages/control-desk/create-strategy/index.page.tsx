import { Button, Flex, Heading, Icon, Link, Spacer, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import { getControlDeskLayout } from "@components/Layout";
import { Code3Icon } from '@fusion-icons/react/interface';
import { ReactElement } from "react";


const ControlDeskUrls = {
  OnceOffPayment: '/control-desk/create-strategy/once-off-payment/assets',
  PayrollAutomation: 'https://www.youtube.com/',
  TreasuryExchange: 'https://www.youtube.com/',
}

type ControlDeskStrategyProps = {
  name: string;
  description: string;
  icon: ReactElement;
  enabled?: boolean;
  href?: string;
  learnMoreHref: string;
};



export function ControlDeskPanels({ name, icon, href, learnMoreHref, description, enabled }: ControlDeskStrategyProps) {
  return (
    <Stack direction={['row', null, null, 'column']} width={['full', null, null, '2xl']}>

      <Flex layerStyle="panel" px={8} py={4} alignItems="center" minH={60}>
        <VStack spacing={4}>
          {icon}
          <Heading size="md">{name}</Heading>
          <Text textStyle="body" textAlign='center'>
            {description}</Text>
          <Link href={href}>
            <Button w={44} color="brand.200" textColor='abyss.200'>
              Get started
            </Button>
          </Link>
          <Link href={learnMoreHref} isExternal textColor='whiteAlpha.800' _hover={{ textColor: 'blue.200' }}>
            Learn more
          </Link>
        </VStack>
      </Flex>
    </Stack>
  );
}


export function ControlDesk() {

  function controlDeskStrategies(): ControlDeskStrategyProps[] {
    const ControlDeskStrategy = [
      {
        name: 'Once off payment',
        description: 'Deposit an asset, use it to DCA into the asset you want to make the payment in and once the grant target amount is reached, get the remaining assets returned back to your treasury.',
        icon: <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />,
        enabled: true,
        href: ControlDeskUrls.OnceOffPayment,
        learnMoreHref: '',
      },
      {
        name: 'Payroll Automation',
        description: 'Consistently DCA out of treasury assets to prevent price impact and make regular payments in stables to one or more parties on a regular basis.',
        icon:
          <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />
        ,
        enabled: true,
        href: ControlDeskUrls.OnceOffPayment,
        learnMoreHref: '',
      },
      {
        name: 'Treasury exchange',
        description: "Can't agree on a fair OTC price? Swap tokens over time with another treasury and turn a single transactional event into a long lasting relationship.",
        icon:
          <Icon as={Code3Icon} stroke="whiteAlpha.900" strokeWidth={5} w={6} h={6} />
        ,
        enabled: true,
        href: ControlDeskUrls.OnceOffPayment,
        learnMoreHref: '',
      }
    ] as ControlDeskStrategyProps[]

    return ControlDeskStrategy
  }

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
      <Stack>
        <Heading size="md">Tools</Heading>
        <Wrap spacing={2} pb={1} shouldWrapChildren align="center">

          <Flex gap={8} w='auto' wrap="wrap" >
            {controlDeskStrategies().map((strategy) => (
              <ControlDeskPanels key={strategy.name} {...strategy} />
            ))}
          </Flex>
        </Wrap>
      </Stack>
    </Stack>
  )
}


ControlDesk.getLayout = getControlDeskLayout;

export default ControlDesk;