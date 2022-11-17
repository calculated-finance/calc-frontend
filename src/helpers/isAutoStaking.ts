import { Strategy } from '@hooks/useStrategies';
import { Destination } from 'src/interfaces/generated/response/get_vaults_by_address';

export function isAutoStaking(destinations: Destination[]) {
  return destinations.length > 0 && destinations[0].address.startsWith('kujiravaloper');
}
export function isStrategyAutoStaking(strategy: Strategy) {
  return isAutoStaking(strategy.destinations);
}
