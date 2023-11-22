import { createContext } from 'react';
import { useCosmosKit } from './useCosmosKit';
import { useChainId } from './useChainId';

export interface CalcWalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const DEFAULT_CONTEXT = {
  setVisible() {},
  visible: false,
};
Object.defineProperty(DEFAULT_CONTEXT, 'visible', {
  get() {
    return false;
  },
});

export const CalcWalletModalContext = createContext<CalcWalletModalContextState>(
  DEFAULT_CONTEXT as CalcWalletModalContextState,
);

export function useWalletModal(): CalcWalletModalContextState {
  const { chainId } = useChainId();
  const { openView, closeView } = useCosmosKit(chainId);

  return {
    setVisible: (value) => (value ? openView() : closeView()),
    visible: false,
  };
}
