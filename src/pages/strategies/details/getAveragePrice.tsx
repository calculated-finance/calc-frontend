import { getTotalReceived } from 'src/helpers/strategy/getTotalReceived';
import { Event } from 'src/interfaces/generated/response/get_events_by_resource_id';
import { Vault } from 'src/interfaces/generated/response/get_vault';
import { getTotalCost } from './getTotalCost';

export function getAveragePrice(strategy: Vault, strategyEvents: Event[]) {
  return getTotalReceived(strategy) / getTotalCost(strategy, strategyEvents);
}
