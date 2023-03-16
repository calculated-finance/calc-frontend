import { StrategyEvent } from '@hooks/useStrategyEvents';
import { convertDenomFromCoin } from '@utils/getDenomInfo';

export type SwapEvent = {
  time: Date;
  received: number;
  fee: number;
  sent: number;
};

export function createSwapEvent(strategyEvent: StrategyEvent): SwapEvent | null {
  // get data from strategyEvent
  const { data } = strategyEvent;

  // check that event is a swap event
  if (!('dca_vault_execution_completed' in data)) {
    return null;
  }

  const { received, fee, sent } = data.dca_vault_execution_completed;
  const { timestamp } = strategyEvent;

  return {
    time: new Date(Number(timestamp) / 1000000),
    received: convertDenomFromCoin(received),
    fee: convertDenomFromCoin(fee),
    sent: convertDenomFromCoin(sent),
  };
}

export function getCreationDate(strategyEvents: StrategyEvent[]) {
  const creationEvent = strategyEvents.find((event) => 'dca_vault_created' in event.data);

  if (!creationEvent) {
    return null;
  }

  return new Date(Number(creationEvent.timestamp) / 1000000);
}

export function filterSwapEventsByTime(swapEvents: SwapEvent[], startTime: Date, endTime: Date) {
  return swapEvents.filter((event) => event.time >= startTime && event.time <= endTime);
}
