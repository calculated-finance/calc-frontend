import * as amplitude from '@amplitude/analytics-browser';
import { featureFlags } from 'src/constants';

amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
  defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
});

export function useAnalytics() {
  const track = (eventName: string, eventProperties?: any) => {
    if (featureFlags.amplitudeEnabled) {
      amplitude.track(eventName, eventProperties);
    }
  };

  return { track };
}
