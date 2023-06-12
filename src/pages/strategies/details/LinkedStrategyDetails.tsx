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
import useFiatPrice from '@hooks/useFiatPrice';
import { Strategy } from '@hooks/useStrategies';
import { formatFiat } from '@helpers/format/formatFiat';
import { getStrategyInitialDenom, getStrategyResultingDenom, isBuyStrategy } from '@helpers/strategy';
import useDexFee from '@hooks/useDexFee';
import { TransactionType } from '@components/TransactionType';
import { getStrategyReinvestStrategyId } from '@helpers/destinations';
import { StrategyModal } from '@components/Reinvest';
import { ArrowForwardIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import Lottie from 'lottie-react';
import looping from 'src/animations/looping.json';
import { getPerformanceStatistics } from './getPerformanceStatistics';

export function LinkedStrategyDetails({
  originalStrategy,
  marketValueInFiat,
  linkedToStrategy,
}: {
  originalStrategy: Strategy;
  marketValueInFiat: number;
  linkedToStrategy: Strategy;
}) {
  const [isClicked, setIsClicked] = useState('');
  const curStrategy = linkedToStrategy;
  const linkingIntoId = getStrategyReinvestStrategyId(curStrategy);

  const initialDenom = getStrategyInitialDenom(curStrategy);
  const resultingDenom = getStrategyResultingDenom(curStrategy);
  const { dexFee } = useDexFee(
    initialDenom,
    resultingDenom,
    isBuyStrategy(curStrategy) ? TransactionType.Buy : TransactionType.Sell,
  );

  const { price: resultingDenomPrice } = useFiatPrice(resultingDenom);
  const { price: initialDenomPrice } = useFiatPrice(initialDenom);

  const isLooped = originalStrategy.id === linkingIntoId;

  const {
    color,
    percentageChange,
    profit,
    marketValueInFiat: linkedMarketValueInFiat,
  } = getPerformanceStatistics(curStrategy, initialDenomPrice, resultingDenomPrice, dexFee);

  const value = formatFiat(marketValueInFiat);
  const linkedValue = formatFiat(linkedMarketValueInFiat);

  const totalValue = formatFiat(marketValueInFiat + linkedMarketValueInFiat);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const clickedId = e.currentTarget.id;
    setIsClicked(clickedId);
  };
  const modalStrategy = isClicked === 'original-strategy' ? originalStrategy : linkedToStrategy;

  return (
    <>
      <GridItem colSpan={1}>
        <Heading size="xs">Linked strategy total value:</Heading>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontSize="sm" data-testid="strategy-asset-price">
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
                    <IconButton
                      colorScheme="blue"
                      icon={<InfoOutlineIcon />}
                      aria-label="More details"
                      variant="ghost"
                      onClick={onOpen}
                      size="xs"
                      display={{ base: 'none', sm: 'initial' }}
                      id="original-strategy"
                      onMouseDown={handleClick}
                    />
                  </HStack>
                </Text>
              </HStack>

              <HStack>
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  Value:
                </Text>
                <Text whiteSpace="nowrap" fontSize={{ base: 10, md: 12 }}>
                  {' '}
                  {value}
                </Text>
              </HStack>
            </Stack>{' '}
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
                  Linked Strategy:{' '}
                </Text>
                <Code fontSize={{ base: 'xx-small', sm: 'x-small' }} bgColor="abyss.200">
                  id: {curStrategy.id}
                </Code>
                <IconButton
                  colorScheme="blue"
                  icon={<InfoOutlineIcon />}
                  aria-label="More details"
                  variant="ghost"
                  onClick={onOpen}
                  size="xs"
                  display={{ base: 'none', sm: 'initial' }}
                  id="linked-strategy"
                  onMouseDown={handleClick}
                />
              </HStack>
              <HStack>
                <Text fontSize={{ base: 10, md: 12 }} fontWeight="bold">
                  Value:
                </Text>
                <Text fontSize={{ base: 10, md: 12 }}> {linkedValue} </Text>
              </HStack>
            </Stack>{' '}
          </GridItem>
        </Grid>
        <StrategyModal strategy={modalStrategy} isOpen={isOpen} onClose={onClose} />
      </GridItem>
    </>
  );
}
