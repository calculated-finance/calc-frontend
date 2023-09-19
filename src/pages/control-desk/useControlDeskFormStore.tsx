import { isNil } from 'lodash';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum ControlDeskFormNames {
  OnceOffPayment = 'onceOffPayment',
  PayrollAutomation = 'payrollAutomation',
  TreasuryExchange = 'treasuryExchange',
}

type IFormStore = {
  forms: any;
  address: string | null;
  updateForm: (formName: ControlDeskFormNames, address: string | undefined) => (payload: any) => void;
  resetForm: (formName: ControlDeskFormNames) => () => void;
};

export const useControlDeskFormStore = create<IFormStore>()(
  persist(
    (set, get) => ({
      address: null,
      forms: {},
      updateForm: (formName: ControlDeskFormNames, address: string | undefined) => {
        if (get().address && !isNil(address) && get().address !== address) {
          get().resetForm(formName)();
        }
        return (payload: any) =>
          set((state: any) => ({
            forms: {
              ...state.forms,
              [formName]: {
                ...state.forms[formName],
                ...payload,
              },
            },
            address,
          }));
      },

      resetForm: (formName: ControlDeskFormNames) => () =>
        set((state: any) => ({
          forms: {
            ...state.forms,
            [formName]: {},
          },
          address: null,
        })),
    }),
    {
      name: 'form-state',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
