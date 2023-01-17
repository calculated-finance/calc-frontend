import { ExecutionIntervals } from '../models/ExecutionIntervals';

const executionIntervalDisplay: Record<ExecutionIntervals, [string, string]> = {
  half_hourly: ['half hour', 'half hours'],
  hourly: ['hour', 'hours'],
  daily: ['day', 'days'],
  half_daily: ['half day', 'half days'],
  weekly: ['week', 'weeks'],
  fortnightly: ['fortnight', 'fortnights'],
  monthly: ['month', 'months'],
};

export const executionIntervalLabel: Record<ExecutionIntervals, string> = {
  half_hourly: 'Half-hourly',
  hourly: 'Hourly',
  daily: 'Daily',
  half_daily: 'Half-daily',
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
};

export default executionIntervalDisplay;
