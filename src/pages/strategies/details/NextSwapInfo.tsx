import { Heading, Text, HStack, Flex, Stack, Icon } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { Strategy } from '@hooks/useStrategies';
import DenomIcon from '@components/DenomIcon';
import Lottie from 'lottie-react';
import arrow from 'src/animations/arrow.json';
import { Denom } from '@models/Denom';
import {
  getStrategyInitialDenom,
  getStrategyResultingDenom,
  isStrategyOperating,
  isBuyStrategy,
} from '@helpers/strategy';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function Diagram({ initialDenom, resultingDenom }: { initialDenom: Denom; resultingDenom: Denom }) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <Flex justify="space-between" gap={2} align="center">
      <HStack>
        <DenomIcon size={5} denomName={initialDenom} />
        <Text>{initialDenomName}</Text>
      </HStack>
      <Flex display={{ base: 'none', md: 'initial' }}>
        <Lottie animationData={arrow} loop height="100%" />
      </Flex>
      <Icon as={ArrowForwardIcon} display={{ base: 'initial', md: 'none' }} />
      <HStack>
        <DenomIcon size={5} denomName={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </Flex>
  );
}

export function NextSwapInfo({ strategy }: { strategy: Strategy }) {
  let nextSwapInfo;

  const { trigger } = strategy;

  const initialDenom = getStrategyInitialDenom(strategy);
  const resultingDenom = getStrategyResultingDenom(strategy);

  if (trigger) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { time, fin_limit_order } = trigger || {};
    const targetTime = time?.target_time;

    const targetPrice = fin_limit_order?.target_price;

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
        const { priceDeconversion, pricePrecision } = isBuyStrategy(strategy)
          ? getDenomInfo(resultingDenom)
          : getDenomInfo(initialDenom);
        const convertedPrice = Number(priceDeconversion(Number(targetPrice)).toFixed(pricePrecision));

        if (isBuyStrategy(strategy)) {
          nextSwapInfo = (
            <>
              When price hits 1 {getDenomInfo(resultingDenom).name} &le; {convertedPrice}{' '}
              {getDenomInfo(initialDenom).name}
            </>
          );
        } else {
          nextSwapInfo = (
            <>
              When price hits 1 {getDenomInfo(initialDenom).name} &ge; {convertedPrice}{' '}
              {getDenomInfo(resultingDenom).name}
            </>
          );
        }
      }
    }
  }
  return nextSwapInfo ? (
    <Stack mb={8} py={4} px={8} layerStyle="panel" direction={{ base: 'column', sm: 'row' }} spacing={4}>
      <HStack spacing={4} w={{ sm: '50%', base: '100%' }}>
        <Heading size="xs" whiteSpace={{ base: 'nowrap', sm: 'normal' }}>
          Next swap:
        </Heading>
        <Text whiteSpace={{ base: 'nowrap', sm: 'normal' }} fontSize="sm" data-testid="next-swap-info">
          {nextSwapInfo}
        </Text>
      </HStack>

      <Flex w={{ sm: '50%', base: '100%' }}>
        <Diagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
      </Flex>
    </Stack>
  ) : null;
}
