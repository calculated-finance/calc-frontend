import { Destination } from 'src/interfaces/v1/generated/response/get_vaults_by_address';

export function isAutoStaking(destinations: Destination[]) {
  return destinations.length > 0 && destinations[0].address.startsWith('kujiravaloper');
}
