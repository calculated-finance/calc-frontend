import { Heading, Text, HStack, Flex, Stack, Icon, Box } from '@chakra-ui/react';
import { Strategy } from '@models/Strategy';
import DenomIcon from '@components/DenomIcon';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isStrategyOperating,
  isBuyStrategy,
  getTargetPrice,
} from '@helpers/strategy';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import usePairs from '@hooks/usePairs';
import { DenomInfo } from '@utils/DenomInfo';

function Diagram({ initialDenom, resultingDenom }: { initialDenom: DenomInfo; resultingDenom: DenomInfo }) {
  const { name: initialDenomName } = initialDenom;
  const { name: resultingDenomName } = resultingDenom;
  return (
    <Flex justify="space-between" gap={2} align="center" w="full">
      <HStack>
        <DenomIcon size={5} denomInfo={initialDenom} />
        <Text>{initialDenomName}</Text>
      </HStack>
      <Flex display={{ base: 'none', lg: 'initial' }} flexShrink={1}>
        <Box as={Lottie} animationData={arrow} loop w={{ base: 16, lg: 120, xl: 'initial' }} />
      </Flex>
      <Icon as={ArrowForwardIcon} display={{ lg: 'none' }} />
      <HStack>
        <DenomIcon size={5} denomInfo={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </Flex>
  );
}

export function NextSwapInfo({ strategy }: { strategy: Strategy }) {
  let nextSwapInfo;

  const { trigger } = strategy.rawData;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  const { data: pairsData } = usePairs();

  if (trigger) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { time } = trigger || {};
    const targetTime = time?.target_time;

    const targetPrice = getTargetPrice(strategy, pairsData?.pairs);

    if (isStrategyOperating(strategy)) {
      if (targetTime) {
        const nextSwapDate = new Date(Number(time?.target_time) / 1000000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        const nextSwapTime = new Date(Number(time?.target_time) / 1000000).toLocaleTimeString('en-US', {
          minute: 'numeric',
          hour: 'numeric',
        });
        nextSwapInfo = (
          <>
            {nextSwapDate} at {nextSwapTime}
          </>
        );
      } else if (targetPrice) {
        const { priceDeconversion, pricePrecision } = isBuyStrategy(strategy) ? resultingDenom : initialDenom;

        const convertedPrice = Number(priceDeconversion(targetPrice).toFixed(pricePrecision));

        if (isBuyStrategy(strategy)) {
          nextSwapInfo = (
            <>
              When price hits 1 {resultingDenom.name} &le; {convertedPrice} {initialDenom.name}
            </>
          );
        } else {
          nextSwapInfo = (
            <>
              When price hits 1 {initialDenom.name} &ge; {convertedPrice} {resultingDenom.name}
            </>
          );
        }
      }
    }
  }
  return nextSwapInfo ? (
    <Stack mb={8} py={4} px={8} layerStyle="panel" direction={{ base: 'column', sm: 'row' }} spacing={4}>
      <HStack spacing={4} w={{ sm: '50%' }}>
        <Heading size="xs" whiteSpace={{ base: 'nowrap', sm: 'normal' }}>
          Next swap:
        </Heading>
        <Text whiteSpace={{ base: 'nowrap', sm: 'normal' }} fontSize="sm" data-testid="next-swap-info">
          {nextSwapInfo}
        </Text>
      </HStack>

      <Flex w={{ sm: '50%' }}>
        <Diagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
      </Flex>
    </Stack>
  ) : null;
}
