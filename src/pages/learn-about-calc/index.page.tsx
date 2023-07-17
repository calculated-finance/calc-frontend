import { Button, Flex, Grid, GridItem, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { getSidebarLayout } from '@components/Layout';
import { LearningHubLinks } from '@components/LearningHubLinks';

export function DcaLearn() {
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      <Stack spacing={4}>
        <Heading size="md">Dollar Cost Averaging (DCA)</Heading>
        <Text textStyle="body">
          Regularly invest a fixed amount of funds into a particular asset or investment over custom time intervals you
          set.
        </Text>
        <Link href={LearningHubLinks.Dca} isExternal>
          <Button w={44} variant="outline" color="brand.200">
            Start learning
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
}
export function DcaPlusLearn() {
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      <Stack spacing={4}>
        <Heading size="md">Algorithm DCA+</Heading>
        <Text textStyle="body">
          Similar to regular DCA, but let a machine learning algorithm decide when to make swaps.
        </Text>
        <Link href={LearningHubLinks.DcaPlus} isExternal>
          <Button w={44} variant="outline" color="brand.200">
            Start learning
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
}
export function WeightedScaleLearn() {
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      <Stack spacing={4}>
        <Heading size="md">Weighted Scale</Heading>
        <Text textStyle="body">
          Swap more when the price moves in the right direction and less when it doesn&apos;t.
        </Text>
        <Link href={LearningHubLinks.WeightedScale} isExternal>
          <Button w={44} variant="outline" color="brand.200">
            Start learning
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
}

export function GeneralLearn() {
  return (
    <Flex layerStyle="panel" p={8} alignItems="center">
      <Stack spacing={4}>
        <Heading size="md">More About CALC</Heading>
        <Text textStyle="body">
          Interested in why Calculated Finance was built and why so many contributors help pitch in?
        </Text>
        <Link href={LearningHubLinks.MoreAboutCalc}>
          <Button w={44} variant="outline" colorScheme="blue">
            Start learning
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
}

export function LearnAboutCalc() {
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
          <DcaLearn />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <DcaPlusLearn />
        </GridItem>
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <WeightedScaleLearn />
        </GridItem>
      </Grid>
      <Heading size="md">General education</Heading>

      <Grid gap={6} templateColumns="repeat(6, 1fr)" templateRows="1fr" alignItems="stretch">
        <GridItem colSpan={{ base: 6, lg: 6, xl: 2 }}>
          <GeneralLearn />
        </GridItem>
      </Grid>
    </Stack>
  );
}

LearnAboutCalc.getLayout = getSidebarLayout;

export default LearnAboutCalc;
