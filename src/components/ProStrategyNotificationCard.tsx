import { Button, Flex, Heading, Link, Stack, Text, Center, Spacer } from '@chakra-ui/react';

export default function ProStrategyNotificationCard({
  title,
  description,
  link,
  backgroundImage,
}: {
  title: string;
  description: string;
  link: string;
  backgroundImage: string;
}) {
  return (
    <Flex layerStyle="panel" p={8}>
      <Stack spacing={2} alignItems="center">
        <Flex
          alignItems="center"
          justify="center"
          backgroundImage={backgroundImage}
          width="100%"
          backgroundSize="cover"
          borderRadius={7}
          height={50}
          backgroundRepeat="no-repeat"
        >
          <Center alignContent="center">
            <Text fontSize={18} fontWeight={700}>
              Coming Soon
            </Text>
          </Center>
        </Flex>
        <Spacer />
        <Heading size="md">{title}</Heading>
        <Stack alignItems="center" spacing={6}>
          <Text textAlign="center" textStyle="body">
            {description}
          </Text>
          <Link width="full" href={link} isExternal>
            <Button width="full" variant="outline" color="brand.200">
              Notify Me
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Flex>
  );
}
