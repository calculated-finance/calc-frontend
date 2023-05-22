import { ExecutionIntervals } from '@models/ExecutionIntervals';

const executionIntervalDisplay: Record<ExecutionIntervals, [string, string]> = {
  minute: ['minute', 'minutes'],
  half_hourly: ['half hour', 'half hours'],
  hourly: ['hour', 'hours'],
  hour: ['hour', 'hours'],
  daily: ['day', 'days'],
  day: ['day', 'days'],
  half_daily: ['half day', 'half days'],
  weekly: ['week', 'weeks'],
  week: ['week', 'weeks'],
  fortnightly: ['fortnight', 'fortnights'],
  monthly: ['month', 'months'],
};

export const executionIntervalLabel: Record<ExecutionIntervals, string> = {
  minute: 'Minutes' || 'Minute',
  half_hourly: 'Half-hourly',
  hourly: 'Hourly',
  hour: 'Hourly',
  daily: 'Daily',
  day: 'Daily',
  half_daily: 'Half-daily',
  weekly: 'Weekly',
  week: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
};

export default executionIntervalDisplay;
