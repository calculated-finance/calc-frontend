import { Grid, GridItem, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { getControlDeskLayout } from "@components/Layout";


export function ControlDeskDashboard() {

  return (
    <Stack>
      <Stack pb={6}>
        <Heading size="lg">Control Desk Dashboard</Heading>
        <Spacer />
        <Text textStyle="md">
          Easily track, and keep up with your performance.
        </Text>
        <Text textStyle="body">
          In order to be calculated, one must be organised. So we organise your stats in one simple place.
        </Text>
      </Stack>
      <Heading size="md">Tools</Heading>
      <Grid gap={8} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch" pb={6}>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          ah
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          ha
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          cha
        </GridItem>
      </Grid>
    </Stack>
  )
}


ControlDeskDashboard.getLayout = getControlDeskLayout;

export default ControlDeskDashboard;