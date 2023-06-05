import * as amplitude from '@amplitude/analytics-browser';
import { featureFlags } from 'src/constants';

export function useAnalytics() {
  const track = (eventName: string, eventProperties?: any) => {
    if (featureFlags.amplitudeEnabled) {
      amplitude.track(eventName, eventProperties);
    }
  };

  return { track };
}
