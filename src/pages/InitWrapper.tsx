import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { useKujira } from '@hooks/useKujira';
import { useKeplr } from '@hooks/useKeplr';
import { useChain } from '@hooks/useChain';
import { useCosmWasmClientStore } from '@hooks/useCosmWasmClientStore';
import { useOsmosis } from '@hooks/useOsmosis';
import { useLeap } from '@hooks/useLeap';
import { useXDEFI } from '@hooks/useXDEFI';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { HOTJAR_SITE_ID, featureFlags } from 'src/constants';
import { useMetamask } from '@hooks/useMetamask';
import { hotjar } from 'react-hotjar';

function initAmplitude() {
  if (featureFlags.amplitudeEnabled) {
    amplitude.init('6c73f6d252d959716850893db0164c57', undefined, {
      defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
    });
  }
}

export function InitWrapper({ children }: ChildrenProp) {
  const { chain } = useChain();

  // const initStation = useStation((state) => state.init);
  const initKujira = useKujira((state) => state.init);
  const initOsmosis = useOsmosis((state) => state.init);
  const initKeplr = useKeplr((state) => state.init);
  const initLeap = useLeap((state) => state.init);
  const initXDEFI = useXDEFI((state) => state.init);
  const initMetamask = useMetamask((state) => state.init);

  const initCosmWasmClient = useCosmWasmClientStore((state) => state.init);

  useEffect(() => {
    if (HOTJAR_SITE_ID) {
      hotjar.initialize(parseInt(HOTJAR_SITE_ID, 10), 0);
    }
  });

  useEffect(() => {
    initAmplitude();
  }, []);

  // useEffect(() => {
  //   if (featureFlags.stationEnabled) {
  //     if (chain) {
  //       initStation();
  //     }
  //   }
  // }, [initStation, chain]);
  useEffect(() => {
    if (chain) {
      initKeplr(chain);
    }
  }, [initKeplr, chain]);

  useEffect(() => {
    if (chain) {
      initLeap(chain);
    }
  }, [initLeap, chain]);

  useEffect(() => {
    if (chain) {
      initXDEFI(chain);
    }
  }, [initXDEFI, chain]);

  useEffect(() => {
    if (chain) {
      initKujira();
    }
  }, [initKujira, chain]);

  useEffect(() => {
    if (chain) {
      initOsmosis();
    }
  }, [initOsmosis, chain]);

  useEffect(() => {
    if (chain) {
      initCosmWasmClient(chain);
    }
  }, [initCosmWasmClient, chain]);

  useEffect(() => {
    if (chain) {
      initMetamask();
    }
  }, [initMetamask, chain]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
