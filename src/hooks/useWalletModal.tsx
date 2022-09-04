import { createContext, useContext } from 'react';

export interface CalcWalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

function constructMissingProviderErrorMessage(action: string, valueName: string) {
  return (
    'You have tried to '
    + ` ${action} "${valueName}"`
    + ' on a WalletModalContext without providing one.'
    + ' Make sure to render a WalletModalProvider'
    + ' as an ancestor of the component that uses '
    + 'WalletModalContext'
  );
}

const DEFAULT_CONTEXT = {
  setVisible(_open: boolean) {
    console.error(constructMissingProviderErrorMessage('call', 'setVisible'));
  },
  visible: false,
};
Object.defineProperty(DEFAULT_CONTEXT, 'visible', {
  get() {
    console.error(constructMissingProviderErrorMessage('read', 'visible'));
    return false;
  },
});

export const CalcWalletModalContext = createContext<CalcWalletModalContextState>(
  DEFAULT_CONTEXT as CalcWalletModalContextState,
);

export function useWalletModal(): CalcWalletModalContextState {
  return useContext(CalcWalletModalContext);
}
