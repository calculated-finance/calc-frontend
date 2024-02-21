import { createContext } from 'react';
import { useChainContext } from '@hooks/useChainContext';
import { useChainId } from '@hooks/useChainId';

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
  const context = useChainContext(chainId);

  return {
    setVisible: (value) => (context ? (value ? context.openView() : context.closeView()) : null),
    visible: false,
  };
}
