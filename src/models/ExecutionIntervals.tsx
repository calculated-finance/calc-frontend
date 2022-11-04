// eslint-disable-next-line import/prefer-default-export

import { TimeInterval } from 'src/interfaces/generated/response/get_vault';

export type ExecutionInterval = TimeInterval;
export enum ExecutionIntervals {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}
