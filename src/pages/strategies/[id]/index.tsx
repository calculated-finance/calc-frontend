import { Badge, Button, Divider, Heading, Icon, Stack, Wrap, WrapItem, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { getSidebarLayout } from '../../../components/Layout';
import { NextPageWithLayout } from '../../_app';

function Panel({ children }: { children: ReactNode }) {
  return (
    <WrapItem rounded={5} w="xs" layerStyle="panel" p={4}>
      <Flex flexDirection="column" w="full">
        <Stack spacing={4} w="full" alignItems="center">
          {children}
        </Stack>
      </Flex>
    </WrapItem>
  );
}

// eslint-disable-next-line react/function-component-definition
const CreateStrategy: NextPageWithLayout = () => (
  <>
    <Stack direction="row" spacing={4} alignItems="center" pb={12}>
      <Link href="/strategies">
        <Icon cursor="pointer" as={FiArrowLeft} boxSize={8} />
      </Link>
      <Heading>DCA In</Heading>
    </Stack>
    <Heading size="md" pb={6}>
      {' '}
      Strategy details
    </Heading>
    <Wrap spacing={8} pb={8}>
      <Panel>
        <Heading size="md">Strategy status</Heading>
        <Divider />
        <Stack direction="row" spacing={4}>
          <Badge colorScheme="green" p={2}>
            Active
          </Badge>
          <Button variant="ghost" colorScheme="red">
            Cancel
          </Button>
        </Stack>
      </Panel>
      <Panel>
        <Heading size="md">Strategy status</Heading>
        <Divider />
        <Heading size="md">DCA In</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Strategy type</Heading>
        <Divider />
        <Heading size="md">DCA In</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Strategy start date</Heading>
        <Divider />
        <Heading size="md">Sept 22 2022</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Strategy end date</Heading>
        <Divider />
        <Heading size="md">Dec 22 2022</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Current amount in vault</Heading>
        <Divider />
        <Heading size="md">200 USK</Heading>
      </Panel>
    </Wrap>
    <Heading size="md" pb={6}>
      {' '}
      Strategy performance
    </Heading>
    <Wrap spacing={8}>
      <Panel>
        <Heading size="md">Asset</Heading>
        <Divider />
        <Stack direction="row" spacing={4}>
          KUJI
        </Stack>
      </Panel>
      <Panel>
        <Heading size="md">Market value of holdings</Heading>
        <Divider />
        <Heading size="md">$7246.42</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Total accumulated</Heading>
        <Divider />
        <Heading size="md">3,920.1 KUJI</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Net asset cost</Heading>
        <Divider />
        <Heading size="md">$1,746.42</Heading>
      </Panel>
      <Panel>
        <Heading size="md">Profit/Loss</Heading>
        <Divider />
        <Heading size="md">$2,212.07</Heading>
      </Panel>
      <Panel>
        <Heading size="md">% Change</Heading>
        <Divider />
        <Heading size="md">515.21%</Heading>
      </Panel>
    </Wrap>
  </>
);

CreateStrategy.getLayout = getSidebarLayout;

export default CreateStrategy;
