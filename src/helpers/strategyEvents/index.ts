import { StrategyEvent } from '@models/StrategyEvent';

export type SwapEvent = {
  time: Date;
  received: number;
  fee: number;
  sent: number;
};

export function createDcaPlusSwapEvent(strategyEvent: StrategyEvent): SwapEvent | null {
  const { data, timestamp } = strategyEvent;

  if (!('dca_vault_execution_completed' in data)) {
    return null;
  }

  const { received, fee, sent } = data.dca_vault_execution_completed;

  return {
    time: new Date(Number(timestamp) / 1000000),
    received: Number(received.amount),
    fee: Number(fee.amount),
    sent: Number(sent.amount),
  };
}

export function createTradSwapEvent(strategyEvent: StrategyEvent): SwapEvent | null {
  const { data, timestamp } = strategyEvent;

  if (!('simulated_dca_vault_execution_completed' in data)) {
    return null;
  }

  const { received, fee, sent } = data.simulated_dca_vault_execution_completed;

  return {
    time: new Date(Number(timestamp) / 1000000),
    received: Number(received.amount),
    fee: Number(fee.amount),
    sent: Number(sent.amount),
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
