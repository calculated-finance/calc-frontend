import { Button, Box, Heading, Text, Stack, Center, ButtonGroup, Wrap, WrapItem, Image, Flex, Container } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Sidebar from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <>
      <Sidebar>
        <Box maxW="8xl">
          <Stack p={4} spacing={4} direction="column">
            <Box>
              <Heading>
                Welcome to CALC, you've made a great choice!
              </Heading>
              <Text>
                CALC removes the hardest part of trading, emotion! Set & forget, take back your time and forget about being gluded to a computer screen 24/7.
              </Text>
            </Box >
            <Wrap >
              <WrapItem w="md" bg="lightgray" p={4}>
                <Stack spacing={4}>
                  <Heading>
                    Set up your DCA Strategy Now
                  </Heading>
                  <Text>
                    Setting up a DCA strategy with CALC takes just 4 minutes. CALC, the ease of use offered by neobank apps combined with the power of DeFi.
                  </Text>
                  <Button w='full'>
                    Get Started
                  </Button>
                </Stack>
              </WrapItem>
              <WrapItem w="xs" bg="lightgray" p={4}>
                <Stack spacing={4}>
                  <Heading>
                    Fear &amp; Greed Index
                  </Heading>
                  <Center>
                    200 USK
                  </Center>
                  <ButtonGroup>
                    <Button>
                      Get Started
                    </Button>
                    <Button variant={"ghost"}>
                      Learn more
                    </Button>
                  </ButtonGroup>
                </Stack>
              </WrapItem>
              <WrapItem w="xl" bg="lightgray" p={4} h="min-content">
                <Stack direction={"row"} spacing={4}>
                  <Image w={"xs"}></Image>
                  <Stack spacing={4}>
                    <Heading>
                      How does CALC&apos;s DCA Strategy work?
                    </Heading>
                    <Text>
                      Quickly learn the power CALC provides you.
                    </Text>
                    <Button variant="outline">
                      Read more
                    </Button>
                  </Stack>
                </Stack >
              </WrapItem>
            </Wrap>
            <Stack direction="row" bg="lightgray" p={4} spacing={4}>
              <Image boxSize={10} ></Image>
              <Text>
                Dollar-cost averaging is one of the easiest techniques to reduce the volatility risk of investing in crypto, and it’s a great way to practice buy-and-hold investing over a few cycles.
              </Text>
            </Stack>
            <Wrap>
              <WrapItem w="md" bg="lightgray" p={4}>
                <Stack spacing={4}>
                  <Heading>
                    My Active CALC Strategies
                  </Heading>
                  <Text>
                    0
                  </Text>
                  <Button variant={"outline"}>
                    Get Started
                  </Button>
                </Stack>
              </WrapItem>
              <WrapItem w="md" bg="lightgray" p={4}>
                <Stack spacing={4}>
                  <Heading>
                    Effortlessly invest in your favorite crypto assets from your savings.
                  </Heading>
                  <Text>
                    Recurring payments means no stress. Set & forget.
                  </Text>
                  <Image h={6}></Image>
                </Stack>
              </WrapItem>
            </Wrap>
          </Stack>
        </Box>
      </Sidebar>
    </>
  )
}

export default Home
