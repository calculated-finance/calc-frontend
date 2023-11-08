import { createContext, useContext } from 'react';
import { useCosmosKit } from './useCosmosKit';
import { featureFlags } from 'src/constants';

export interface CalcWalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const DEFAULT_CONTEXT = {
  setVisible() {
    // console.error(constructMissingProviderErrorMessage('call', 'setVisible'));
  },
  visible: false,
};
Object.defineProperty(DEFAULT_CONTEXT, 'visible', {
  get() {
    // console.error(constructMissingProviderErrorMessage('read', 'visible'));
    return false;
  },
});

export const CalcWalletModalContext = createContext<CalcWalletModalContextState>(
  DEFAULT_CONTEXT as CalcWalletModalContextState,
);

export function useWalletModal(): CalcWalletModalContextState {
  const context = useContext(CalcWalletModalContext);
  const cosmoskit = useCosmosKit();

  if (featureFlags.cosmoskitEnabled) {
    if (cosmoskit) {
      return {
        setVisible: cosmoskit.openView,
        visible: false,
      };
    }
  }

  return context;
}
