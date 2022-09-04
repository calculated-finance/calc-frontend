import React, { useState } from 'react';
import type { FC, ReactNode } from 'react';

import { CalcWalletModalContext } from 'src/hooks/useWalletModal';
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
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WalletModal {...props} />
    </CalcWalletModalContext.Provider>
  );
}
