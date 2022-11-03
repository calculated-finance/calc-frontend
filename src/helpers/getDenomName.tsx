import { Denom } from '@models/Denom';
import getDenomInfo from '@utils/getDenomInfo';

export function getDenomName(denom: Denom): string {
  const { name } = getDenomInfo(denom);
  return name;
}
