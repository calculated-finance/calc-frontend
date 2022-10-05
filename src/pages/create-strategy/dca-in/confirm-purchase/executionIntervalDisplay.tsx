import { ExecutionIntervals } from '../step2/ExecutionIntervals';

export default {
  [ExecutionIntervals.Hourly]: ['hour', 'hours'],
  [ExecutionIntervals.Daily]: ['day', 'days'],
  [ExecutionIntervals.Weekly]: ['week', 'weeks'],
  [ExecutionIntervals.Monthly]: ['month', 'months'],
};
