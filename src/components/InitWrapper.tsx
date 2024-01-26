import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { HOTJAR_SITE_ID } from 'src/constants';
import { hotjar } from 'react-hotjar';

function initAmplitude() {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
    amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
      defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
    });
  }
}

export function InitWrapper({ children }: ChildrenProp) {
  useEffect(() => {
    if (HOTJAR_SITE_ID) {
      hotjar.initialize(parseInt(HOTJAR_SITE_ID, 10), 0);
    }
  });

  useEffect(() => {
    initAmplitude();
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
