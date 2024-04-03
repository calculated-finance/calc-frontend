import { InitialDenomInfo, ResultingDenomInfo } from '@utils/DenomInfo';
import { Event as GeneratedEvent } from 'src/interfaces/dca/response/get_events_by_resource_id';

export type StrategyEvent = GeneratedEvent & {
  initialDenom: InitialDenomInfo;
  resultingDenom: ResultingDenomInfo;
};
