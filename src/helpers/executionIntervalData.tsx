import { featureFlags } from 'src/constants';
import { ExecutionIntervals } from '../models/ExecutionIntervals';

export const executionIntervalData: { value: ExecutionIntervals; label: string }[] = featureFlags.extraTimeOptions
  ? [
      {
        value: 'half_hourly',
        label: '30m',
      },
      {
        value: 'hourly',
        label: 'Hour',
      },
      {
        value: 'half_daily',
        label: '12hr',
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
        value: 'fortnightly',
        label: '14D',
      },
      {
        value: 'monthly',
        label: 'Month',
      },
    ]
  : [
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
