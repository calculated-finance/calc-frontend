import {
  Heading,
  Grid,
  GridItem,
  Text,
  HStack,
  Stack,
  Code,
  Flex,
  Center,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Strategy } from '@models/Strategy';
import { formatFiat } from '@helpers/format/formatFiat';
import { getStrategyReinvestStrategyId } from '@helpers/destinations';
import { StrategyModal } from '@components/Reinvest';
import { ArrowForwardIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import Lottie from 'lottie-react';
import looping from 'src/animations/looping.json';
import { convertDenomFromCoin } from '@utils/getDenomInfo';

function LinkedStrategyModal({ strategy }: { strategy: Strategy }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        colorScheme="blue"
        icon={<InfoOutlineIcon />}
        aria-label="More details"
        variant="ghost"
        onClick={onOpen}
        size="xs"
        display={{ base: 'none', sm: 'initial' }}
      />
      <StrategyModal strategy={strategy} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export function LinkedStrategyDetails({
  originalStrategy,
  originalStrategyValue,
  linkedToStrategy,
  resultingDenomPrice,
}: {
  originalStrategy: Strategy;
  originalStrategyValue: number;
  linkedToStrategy: Strategy;
  resultingDenomPrice: number;
}) {
  const curStrategy = linkedToStrategy;
  const linkingIntoId = getStrategyReinvestStrategyId(curStrategy);
  const isLooped = originalStrategy.id === linkingIntoId;
  const value = formatFiat(originalStrategyValue);

  const convertedBalance = convertDenomFromCoin(linkedToStrategy.rawData.balance);
  const linkedStrategyValue = resultingDenomPrice * convertedBalance;
  const linkedValue = formatFiat(linkedStrategyValue);
  const totalValue = formatFiat(originalStrategyValue + linkedStrategyValue);

  return (
    <>
      <GridItem colSpan={1}>
        <Heading id="1" size="xs">
          Linked strategy total value:
        </Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="combined-strategy-value">
          {totalValue}
        </Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Grid templateColumns="repeat(8, 1fr)" gap={1} w="full">
          <GridItem colSpan={3}>
            <Stack
              borderRadius={16}
              flexGrow={1}
              alignItems="start"
              bgColor="gray.800"
              h="full"
              spacing={1}
              fontSize="xs"
              py={2}
              px={3}
            >
              <HStack w="full" whiteSpace="nowrap" spacing={{ base: 1, md: 2 }}>
                <Text fontWeight="bold" fontSize={{ base: 10, md: 12 }}>
                  Strategy:
                </Text>
                <Text>
                  <HStack>
                    <Code fontSize={{ base: 'xx-small', sm: 'x-small' }} bgColor="abyss.200">
                      id: {originalStrategy.id}
                    </Code>
                    <LinkedStrategyModal strategy={originalStrategy} />
                  </HStack>
                </Text>
              </HStack>
              <HStack>
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  Value:
                </Text>
                <Text whiteSpace="nowrap" fontSize={{ base: 10, md: 12 }} data-testid="strategy-asset-price">
                  {value}
                </Text>
              </HStack>
              <HStack display={{ base: 'initial', sm: 'none' }} whiteSpace="nowrap">
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  More details:
                  <LinkedStrategyModal strategy={originalStrategy} />
                </Text>
              </HStack>
            </Stack>
          </GridItem>
          <GridItem colSpan={1}>
            {isLooped ? (
              <Center h="full">
                <Center>
                  <Lottie animationData={looping} style={{ padding: 4, height: 50 }} />
                </Center>
              </Center>
            ) : (
              <Flex alignItems="center" justifyContent="center" p={4}>
                <ArrowForwardIcon boxSize={6} />
              </Flex>
            )}
          </GridItem>
          <GridItem colSpan={4}>
            <Stack
              borderRadius={16}
              flexGrow={1}
              alignItems="start"
              bgColor="gray.800"
              h="full"
              spacing={1}
              fontSize="xs"
              py={2}
              px={3}
            >
              <HStack w="full" whiteSpace="nowrap" spacing={{ base: 1, md: 2 }}>
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  Linked Strategy:
                </Text>
                <Code
                  fontSize={{ base: 'xx-small', sm: 'x-small' }}
                  bgColor="abyss.200"
                  data-testid="linked-strategy-id"
                >
                  id: {curStrategy.id}
                </Code>
                <LinkedStrategyModal strategy={linkedToStrategy} />
              </HStack>
              <HStack>
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  Value:
                </Text>
                <Text fontSize={{ base: 10, md: 12 }}>{linkedValue}</Text>
              </HStack>
              <HStack display={{ base: 'initial', sm: 'none' }} whiteSpace="nowrap">
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  More details:
                  <LinkedStrategyModal strategy={linkedToStrategy} />
                </Text>
              </HStack>
            </Stack>
          </GridItem>
        </Grid>
      </GridItem>
    </>
  );
}
