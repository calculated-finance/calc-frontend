import { createContext, useContext } from 'react';
import { featureFlags } from 'src/constants';
import { useCosmosKit } from './useCosmosKit';
import { useChainId } from './useChain';

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
  const { chainId: chain } = useChainId();
  const cosmoskit = useCosmosKit(chain);

  return cosmoskit
    ? {
        setVisible: cosmoskit.openView,
        visible: false,
      }
    : context;
}
