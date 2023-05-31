import * as amplitude from '@amplitude/analytics-browser';

amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
  defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
});

export function useAnalytics() {
  const track = (eventName: string, eventProperties?: any) => {
    amplitude.track(eventName, eventProperties);
  };

  return { track };
}
