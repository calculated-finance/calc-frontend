import { Heading, Text, HStack } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import { isStrategyOperating } from 'src/helpers/getStrategyStatus';
import { Strategy } from '@hooks/useStrategies';
import { getStrategyType } from 'src/helpers/getStrategyType';
import { StrategyTypes } from '@models/StrategyTypes';
import { getStrategyResultingDenom } from '../../../helpers/getStrategyResultingDenom';
import { getStrategyInitialDenom } from '../../../helpers/getStrategyInitialDenom';

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
        if (getStrategyType(strategy) === StrategyTypes.DCAIn) {
          nextSwapInfo = (
            <>
              When price hits 1 {getDenomInfo(resultingDenom).name} &le; {Number(targetPrice)}{' '}
              {getDenomInfo(initialDenom).name}
            </>
          );
        } else {
          nextSwapInfo = (
            <>
              When price hits 1 {getDenomInfo(initialDenom).name} &ge; {Number(targetPrice)}{' '}
              {getDenomInfo(resultingDenom).name}
            </>
          );
        }
      }
    }
  }
  return nextSwapInfo ? (
    <HStack
      mb={8}
      py={4}
      px={8}
      layerStyle="panel"
      spacing={4}
      backgroundImage="/images/backgrounds/thin.svg"
      backgroundPosition="center"
      backgroundSize="cover"
    >
      <Heading size="xs">Next swap:</Heading>
      <Text fontSize="sm" data-testid="next-swap-info">
        {nextSwapInfo}
      </Text>
    </HStack>
  ) : null;
}
