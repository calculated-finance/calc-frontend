import { TransactionType } from '@components/TransactionType';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { useEffect } from 'react';
import { create } from 'zustand';
import { ControlDeskStrategyTypes } from './ControlDeskStrategyTypes';
import { ControlDeskFormNames } from './useControlDeskFormStore';

export type ControlDeskStrategyInfo = {
  strategyType: ControlDeskStrategyTypes;
  transactionType: TransactionType;
  formName: ControlDeskFormNames;
};


type ControlDeskStrategyInfoStore = {
  strategyInfo: ControlDeskStrategyInfo | null;
  setStrategyInfo: (strategyInfo: ControlDeskStrategyInfo) => void;
};

export const useControlDeskStrategyInfoStore = create<ControlDeskStrategyInfoStore>()((set) => ({
  strategyInfo: null,
  setStrategyInfo: (strategyInfo: ControlDeskStrategyInfo) => set({ strategyInfo }),
}));

export function useControlDeskStrategyInfo() {
  const strategyInfo = useControlDeskStrategyInfoStore(state => state.strategyInfo);

  if (!strategyInfo) {
    throw new Error('Strategy info must be set before accessing it.');
  }

  return strategyInfo;
}

export function ControlDeskStrategyInfoProvider({ strategyInfo, children }: { strategyInfo: ControlDeskStrategyInfo } & ChildrenProp) {
  const setStrategyInfo = useControlDeskStrategyInfoStore(state => state.setStrategyInfo);
  const strategyInfoState = useControlDeskStrategyInfoStore(state => state.strategyInfo);

  useEffect(() => {
    setStrategyInfo(strategyInfo);
  }, [setStrategyInfo, strategyInfo]);

  // Only render children if the state is set
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return strategyInfoState ? <>{children}</> : null;
}


