import { ExecutionIntervals } from '@models/ExecutionIntervals';

export const executionIntervalData: { value: ExecutionIntervals; label: string }[] = [
  {
    value: 'half_hourly',
    label: 'Half-hour',
  },
  {
    value: 'hourly',
    label: 'Hour',
  },
  {
    value: 'half_daily',
    label: 'Half-day',
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
