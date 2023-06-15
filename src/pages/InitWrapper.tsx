import { useEffect } from 'react';
import { useKujira } from '@hooks/useKujira';
import { useKeplr } from '@hooks/useKeplr';
import { useChain } from '@hooks/useChain';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { useOsmosis } from '@hooks/useOsmosis';
import { useLeap } from '@hooks/useLeap';
import { useXDEFI } from '@hooks/useXDEFI';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { initAmplitude } from './_app.page';

export function InitWrapper({ children }: ChildrenProp) {
  const { chain } = useChain();

  // const initStation = useStation((state) => state.init);
  const initKujira = useKujira((state) => state.init);
  const initOsmosis = useOsmosis((state) => state.init);
  const initKeplr = useKeplr((state) => state.init);
  const initLeap = useLeap((state) => state.init);
  const initXDEFI = useXDEFI((state) => state.init);

  const initCosmWasmClient = useCosmWasmClient((state) => state.init);

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

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
