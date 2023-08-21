import { Grid, GridItem, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { getControlDeskSidebarLayout } from "@components/Layout/ControlDeskSideBar";


export function ControlDeskMyStrategies() {

  return (
    <Stack>
      <Stack pb={6}>
        <Heading size="lg">Check your stratgies here</Heading>
        <Spacer />
        <Text textStyle="md">
          Built for treasuries to pay salaries, grants, and swap tokens the calculated way.
        </Text>
        <Text textStyle="body">
          Choose an option that suits you and your treasury.        </Text>
      </Stack>
      <Heading size="md">Tools</Heading>
      <Grid gap={8} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch" pb={6}>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          My
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


ControlDeskMyStrategies.getLayout = getControlDeskSidebarLayout;

export default ControlDeskMyStrategies;