import { Heading, Text, HStack, Flex } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { isStrategyOperating } from 'src/helpers/getStrategyStatus';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { StrategyTypes } from '@models/StrategyTypes';
import DenomIcon from '@components/DenomIcon';
import Lottie from 'lottie-react';
import arrow from 'src/pages/create-strategy/dca-in/confirm-purchase/arrow.json';
import { Denom } from '@models/Denom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';

function Diagram({ initialDenom, resultingDenom }: { initialDenom: Denom; resultingDenom: Denom }) {
  const { name: initialDenomName } = getDenomInfo(initialDenom);
  const { name: resultingDenomName } = getDenomInfo(resultingDenom);
  return (
    <HStack spacing={5}>
      <HStack>
        <DenomIcon size={5} denomName={initialDenom} />
        <Text>{initialDenomName}</Text>
      </HStack>
      <Lottie animationData={arrow} loop height="100%" />
      <HStack>
        <DenomIcon size={5} denomName={resultingDenom} />
        <Text>{resultingDenomName}</Text>
      </HStack>
    </HStack>
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
        const { priceDeconversion } = getDenomInfo(resultingDenom);
        const convertedPrice = priceDeconversion(Number(targetPrice));

        if (getStrategyType(strategy) === StrategyTypes.DCAIn) {
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
    <HStack mb={8} py={4} px={8} layerStyle="panel" spacing={8}>
      <HStack spacing={4} w="50%">
        <Heading size="xs">Next swap:</Heading>
        <Text fontSize="sm" data-testid="next-swap-info">
          {nextSwapInfo}
        </Text>
      </HStack>
      <Flex w="50%">
        <Diagram initialDenom={initialDenom} resultingDenom={resultingDenom} />
      </Flex>
    </HStack>
  ) : null;
}
