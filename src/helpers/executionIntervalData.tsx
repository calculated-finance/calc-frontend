import { ExecutionIntervals } from '@models/ExecutionIntervals';

export const executionIntervalData: { value: ExecutionIntervals; label: string }[] = [
  {
    value: 'hourly',
    label: 'Hour',
  },
  {
    value: 'daily',
    label: 'Day',
  },
  {
    value: 'weekly',
    label: 'Week',
  },

  {
    value: 'monthly',
    label: 'Month',
  },
];
