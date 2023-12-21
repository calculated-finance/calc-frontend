import * as amplitude from '@amplitude/analytics-browser';

export function useAnalytics() {
  const track = (eventName: string, eventProperties?: any) => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
      amplitude.track(eventName, eventProperties);
    }
  };

  return { track };
}
