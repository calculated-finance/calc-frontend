import React, { useState } from 'react';
import type { ReactNode } from 'react';

import { CalcWalletModalContext } from 'src/hooks/useWalletModal';
import { featureFlags } from 'src/constants';
import WalletModal from './WalletModal';

export interface WalletModalProviderProps {
  children: ReactNode;
}

export function CalcWalletModalProvider({ children, ...props }: WalletModalProviderProps) {
  const [visible, setVisible] = useState(false);

  return (
    <CalcWalletModalContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      {!featureFlags.cosmoskitEnabled && <WalletModal {...props} />}
    </CalcWalletModalContext.Provider>
  );
}
