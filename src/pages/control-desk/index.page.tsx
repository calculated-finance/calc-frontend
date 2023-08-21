import { Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/react";
import { getFlowLayout } from "@components/Layout";




function ControlDesk() {

  return (
    <Stack>
      <Stack pb={6}>
        <Heading size="lg">Welcome to the CALC learning hub.</Heading>
        <Text textStyle="body">
          Click through the panels below to learn about each of our products, and how to use them.
        </Text>
      </Stack>
      <Heading size="md">Tools</Heading>
      <Grid gap={8} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch" pb={6}>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          Blah blah
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          Blah blah
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          Blah blah
        </GridItem>
      </Grid>
      <Heading size="md">General education</Heading>

      <Grid gap={6} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch">
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          Blah blah
        </GridItem>
      </Grid>
    </Stack>
  )
}


function Page() {
  return (
    <ControlDesk />
  );
}

Page.getLayout = getFlowLayout;

export default Page;