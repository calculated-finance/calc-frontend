import { ExecutionIntervals } from '@models/ExecutionIntervals';

export const executionIntervalData: { value: ExecutionIntervals; label: string }[] = [
  {
    value: 'hourly',
    label: 'Hourly',
  },
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'weekly',
    label: 'Weekly',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
];
