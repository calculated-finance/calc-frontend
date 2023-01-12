import { ExecutionInterval } from '../models/ExecutionIntervals';

const executionIntervalDisplay: Record<ExecutionInterval, [string, string]> = {
  half_hourly: ['half hour', 'half hours'],
  hourly: ['hour', 'hours'],
  daily: ['day', 'days'],
  half_daily: ['half day', 'half days'],
  weekly: ['week', 'weeks'],
  fortnightly: ['fortnight', 'fortnights'],
  monthly: ['month', 'months'],
};

export default executionIntervalDisplay;
