import { TransactionType } from '@components/TransactionType';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { FormNames } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { useEffect } from 'react';
import { create } from 'zustand';

export type StrategyInfo = {
  strategyType: StrategyTypes;
  transactionType: TransactionType;
  formName: FormNames;
};


type StrategyInfoStore = {
  strategyInfo: StrategyInfo | null;
  setStrategyInfo: (strategyInfo: StrategyInfo) => void;
};



export const useStrategyInfoStore = create<StrategyInfoStore>()((set) => ({
  strategyInfo: null,
  setStrategyInfo: (strategyInfo: StrategyInfo) => set({ strategyInfo }),
}));

export function useStrategyInfo() {
  const strategyInfo = useStrategyInfoStore(state => state.strategyInfo);

  if (!strategyInfo) {
    throw new Error('Strategy info must be set before accessing it.');
  }

  return strategyInfo;
}

export function StrategyInfoProvider({ strategyInfo, children }: { strategyInfo: StrategyInfo } & ChildrenProp) {
  const setStrategyInfo = useStrategyInfoStore(state => state.setStrategyInfo);
  const strategyInfoState = useStrategyInfoStore(state => state.strategyInfo);

  useEffect(() => {
    setStrategyInfo(strategyInfo);
  }, [setStrategyInfo, strategyInfo]);

  // Only render children if the state is set
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return strategyInfoState ? <>{children}</> : null;
}


